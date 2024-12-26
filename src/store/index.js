import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import medicineReducer from './slices/medicineSlice';
import donationReducer from './slices/donationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    medicine: medicineReducer,
    donation: donationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
