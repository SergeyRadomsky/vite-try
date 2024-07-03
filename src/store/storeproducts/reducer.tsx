import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface StoreProduct {
  id: number;
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

export const createStoreProduct = createAsyncThunk('storeProducts/createStoreProduct', async (storeProduct: Omit<StoreProduct, 'id'>) => {
  const response = await fetch('/api/store-products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storeProduct),
  });
  const data = await response.json();
  return data;
});

export const updateStoreProduct = createAsyncThunk('storeProducts/updateStoreProduct', async (storeProduct: StoreProduct) => {
  const response = await fetch(`/api/store-products/${storeProduct.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storeProduct),
  });
  const data = await response.json();
  return data;
});

export const deleteStoreProduct = createAsyncThunk('storeProducts/deleteStoreProduct', async (id: number) => {
  await fetch(`/api/store-products/${id}`, {
    method: 'DELETE',
  });
  return id;
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
      })
      .addCase(createStoreProduct.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateStoreProduct.fulfilled, (state, action) => {
        const index = state.data.findIndex((sp) => sp.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteStoreProduct.fulfilled, (state, action) => {
        state.data = state.data.filter((sp) => sp.id !== action.payload);
      });
  },
});

export default storeProductsSlice.reducer;
