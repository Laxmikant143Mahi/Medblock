import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

export const createDonation = createAsyncThunk(
  'donation/createDonation',
  async ({ ngoId, medicines, pickupAddress, notes }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(
        `${API_URL}/donations`,
        { ngoId, medicines, pickupAddress, notes },
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

export const fetchDonations = createAsyncThunk(
  'donation/fetchDonations',
  async ({ status, page = 1, limit = 10 }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(
        `${API_URL}/donations?status=${status}&page=${page}&limit=${limit}`,
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

export const updateDonationStatus = createAsyncThunk(
  'donation/updateStatus',
  async ({ donationId, status, notes }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.patch(
        `${API_URL}/donations/${donationId}/status`,
        { status, notes },
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

export const cancelDonation = createAsyncThunk(
  'donation/cancelDonation',
  async (donationId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.delete(`${API_URL}/donations/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { donationId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  donations: [],
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.donations.unshift(action.payload);
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create donation';
      })
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload.donations;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch donations';
      })
      .addCase(updateDonationStatus.fulfilled, (state, action) => {
        const index = state.donations.findIndex(
          (donation) => donation._id === action.payload._id
        );
        if (index !== -1) {
          state.donations[index] = action.payload;
        }
      })
      .addCase(cancelDonation.fulfilled, (state, action) => {
        state.donations = state.donations.filter(
          (donation) => donation._id !== action.payload.donationId
        );
      });
  },
});

export const { clearError } = donationSlice.actions;
export default donationSlice.reducer;
