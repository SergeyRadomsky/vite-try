// store/products/reducer.tsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchWithAuth from '../../utils/fetchWithAuth';
// import { RootState } from '../store';

export interface Product {
  productid: number;
  productname: string;
}

interface ProductsState {
  data: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetchWithAuth('/api/products');
  const data = await response.json();
  return data;
});

export const createProduct = createAsyncThunk('products/createProduct', async (newProduct: Product) => {
  const response = await fetchWithAuth('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  });
  const data = await response.json();
  return data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (updatedProduct: Product) => {
  const response = await fetchWithAuth(`/api/products/${updatedProduct.productid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedProduct),
  });
  const data = await response.json();
  return data;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId: number) => {
  await fetchWithAuth(`/api/products/${productId}`, {
    method: 'DELETE',
  });
  return productId;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.data.findIndex(product => product.productid === action.payload.productid);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.data = state.data.filter(product => product.productid !== action.payload);
      });
  },
});

export default productsSlice.reducer;

