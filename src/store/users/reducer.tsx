import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// interface Role {
//   id: number;
//   role: string;
// }

export interface User {
  id: number;
  username: string;
  email: string;
  // roles: Role[];
}

interface State {
  data: User[];
  loading: boolean;
  error?: string;
}

const initialState: State = {
  data: [],
  loading: false,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('/api/users');
  const data = await response.json();
  return data;
});

export const createUser = createAsyncThunk('users/createUser', async (user: Omit<User, 'id'>) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  return data;
});

export const updateUser = createAsyncThunk('users/updateUser', async (user: User) => {
  const response = await fetch(`/api/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  return data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: number) => {
  await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.map((user: any) => ({
          ...user,
          roles: user.Roles || []
        }));
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.data.push({
          ...action.payload,
          roles: action.payload.Roles || []
        });
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.data.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = {
            ...action.payload,
            roles: action.payload.Roles || []
          };
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((user) => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
