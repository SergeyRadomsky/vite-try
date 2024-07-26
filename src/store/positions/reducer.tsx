// store/positions/reducer.tsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchWithAuth from '../../utils/fetchWithAuth';
// import { RootState } from '../store';

export interface Position {
  id: number;
  positionname: string;
	salarycoeff?: number;
  notes?: string | null;
  status?: boolean | null;
  date?: Date | null;
}

export type CreatePositionData =  Omit<Position, "id">;

interface PositionsState {
  data: Position[];
  loading: boolean;
  error: string | null;
}

const initialState: PositionsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchPositions = createAsyncThunk('positions/fetchPositions', async () => {
  const response = await fetchWithAuth('/api/positions');
  const data = await response.json();
  return data;
});

export const fetchPositionById = createAsyncThunk('positions/fetchPositionById', async (id: number) => {
  const response = await fetchWithAuth(`/api/positions/${id}`);
  const data = await response.json();
  return data;
});

export const createPosition = createAsyncThunk('positions/createPosition', async (newPosition: CreatePositionData) => {
  const response = await fetchWithAuth('/api/positions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPosition),
  });
  const data = await response.json();
  return data;
});

export const updatePosition = createAsyncThunk('positions/updatePosition', async (updatedPosition: Position) => {
  const response = await fetchWithAuth(`/api/positions/${updatedPosition.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPosition),
  });
  const data = await response.json();
  return data;
});

export const deletePosition = createAsyncThunk('positions/deletePosition', async (positionId: number) => {
  await fetchWithAuth(`/api/positions/${positionId}`, {
    method: 'DELETE',
  });
  return positionId;
});

const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        console.log('pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        console.log('fulfilled');
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        console.log('rejected');
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch positions';
      })
      .addCase(fetchPositionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPositionById.fulfilled, (state, action) => {
        state.loading = false;
        const existingPositionIndex = state.data.findIndex(pos => pos.id === action.payload.id);
        if (existingPositionIndex !== -1) {
          state.data[existingPositionIndex] = action.payload;
        } else {
          state.data.push(action.payload);
        }
      })
      .addCase(fetchPositionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch position';
      })
      .addCase(createPosition.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        const index = state.data.findIndex(position => position.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deletePosition.fulfilled, (state, action) => {
        state.data = state.data.filter(position => position.id !== action.payload);
      });
  },
});


export default positionsSlice.reducer;
