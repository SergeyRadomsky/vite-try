// store/auth/reducer.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
// import { RootState } from '../store';

interface AuthState {
  token: string | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  userId: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password, roles }: { username: string; email: string; password: string; roles: number[] }) => {
    const response = await axios.post('/api/auth/registration', { username, email, password, roles });
    localStorage.setItem('access-token', response.data.token);
    return response.data; 
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('access-token', response.data.token);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.userId = null;
      localStorage.removeItem('access-token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ token: string; userId: string }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; userId: string }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
