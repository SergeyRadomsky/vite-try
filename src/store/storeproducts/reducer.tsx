import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface StoreProduct {
  storeid: number;
  productid: number;
  store: { storename: string };
  product: { productname: string };
}

interface State {
  data: StoreProduct[];
  loading: boolean;
  error?: string;
}

const initialState: State = {
  data: [],
  loading: false,
};

export const fetchStoreProducts = createAsyncThunk('storeProducts/fetchStoreProducts', async (filters: any) => {
  let query = '';
  if (filters.storeId) {
    query += `storeId=${filters.storeId}&`;
  }
  if (filters.productId) {
    query += `productId=${filters.productId}&`;
  }

  const response = await fetch(`/api/store-products?${query}`);
  const data = await response.json();
  return data;
});

const storeProductsSlice = createSlice({
  name: 'storeProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreProducts.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchStoreProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStoreProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default storeProductsSlice.reducer;
