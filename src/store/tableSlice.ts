import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface TableState {
  data: any[];
  columns: string[];
  loading: boolean;
  error: string | null;
}

const initialState: TableState = {
  data: [],
  columns: [],
  loading: false,
  error: null,
};

export const fetchTableData = createAsyncThunk(
  'table/fetchTableData',
  async (tableName: string) => {
    const response = await fetch(`/api/${tableName}`);
    const data = await response.json();
    return data;
  }
);

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.columns = action.payload.length > 0 ? Object.keys(action.payload[0]) : [];
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export default tableSlice.reducer;
