import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Role {
  id: number;
  role: string;
}

interface State {
  data: Role[];
  loading: boolean;
  error?: string | null;
}

const initialState: State = {
  data: [],
  loading: false,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    fetchRolesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRolesSuccess(state, action: PayloadAction<Role[]>) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchRolesError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchRolesStart, fetchRolesSuccess, fetchRolesError } = rolesSlice.actions;

export default rolesSlice.reducer;
