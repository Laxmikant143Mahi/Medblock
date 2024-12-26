import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

export const fetchMedicines = createAsyncThunk(
  'medicine/fetchMedicines',
  async ({ page = 1, limit = 10, search, category }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `${API_URL}/medicines?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const scanMedicine = createAsyncThunk(
  'medicine/scanMedicine',
  async (barcode, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`${API_URL}/medicines/barcode/${barcode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCabinet = createAsyncThunk(
  'medicine/addToCabinet',
  async ({ medicineId, expiryDate, quantity }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${API_URL}/medicines/cabinet`,
        { medicineId, expiryDate, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const reportMedicine = createAsyncThunk(
  'medicine/reportMedicine',
  async ({ medicineId, issue, description }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${API_URL}/medicines/${medicineId}/report`,
        { issue, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  medicines: [],
  cabinet: [],
  scannedMedicine: null,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

const medicineSlice = createSlice({
  name: 'medicine',
  initialState,
  reducers: {
    clearScannedMedicine: (state) => {
      state.scannedMedicine = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload.medicines;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch medicines';
      })
      .addCase(scanMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scanMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.scannedMedicine = action.payload;
      })
      .addCase(scanMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to scan medicine';
      })
      .addCase(addToCabinet.fulfilled, (state, action) => {
        state.cabinet = action.payload;
      })
      .addCase(addToCabinet.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to add medicine to cabinet';
      });
  },
});

export const { clearScannedMedicine, clearError } = medicineSlice.actions;
export default medicineSlice.reducer;
