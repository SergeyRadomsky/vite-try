// store/loader/reducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoaderState {
  isLoading: boolean;
  error: string | null;
}

const initialState: LoaderState = {
  isLoading: false,
  error: null,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { startLoading, stopLoading, setError, clearError } = loaderSlice.actions;
export default loaderSlice.reducer;
