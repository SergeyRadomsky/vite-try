import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Store {
    storeid: number;
    storename: string;
    address: string;
    directorid: number;
}

export type CreateStore = {
    storename: string;
    address: string;
    directorid: number | null;
}

interface StoresState {
    data: Store[];
    loading: boolean;
    error: string | null;
}

const initialState: StoresState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchStores = createAsyncThunk('stores/fetchStores', async () => {
    const response = await fetch('/api/stores');
    const data = await response.json();
    return data;
});

export const createStore = createAsyncThunk('stores/createStore', async (newStore: CreateStore) => {
    const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStore),
    });
    const data = await response.json();
    return data;
});

export const updateStore = createAsyncThunk('stores/updateStore', async (updatedStore: Store) => {
    const response = await fetch(`/api/stores/${updatedStore.storeid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStore),
    });
    console.log(updatedStore);
    
    const data = await response.json();
    return data;
});

export const deleteStore = createAsyncThunk('stores/deleteStore', async (storeId: number) => {
  const response = await fetch(`/api/stores/${storeId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    console.log("успех");
    
    return storeId;
  } else {
    console.log("НЕ успех");
    
    throw new Error('Failed to delete store');
  }
});

const storesSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStores.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch stores';
            })
            .addCase(createStore.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(updateStore.fulfilled, (state, action) => {
                const index = state.data.findIndex((store) => store.storeid === action.payload.storeid);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteStore.fulfilled, (state, action) => {
                state.data = state.data.filter((store) => store.storeid !== action.payload);
            });
    },
});

export default storesSlice.reducer;
