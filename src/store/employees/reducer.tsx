// store/employees/reducer.tsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { RootState } from '../../store/employees/selector';

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await fetch('/api/employees');
  const data = await response.json();
  return data;
});

export interface Employee {
  employeeid: number;
  firstname:  string;
  lastname:   string;
  surname:    string;
  positionid: number;
  storeid:    number;
  bod:        Date;
  position:   Position;
  store:      Store;
}

export interface Position {
  positionname: string;
}

export interface Store {
  storename: string;
}


interface State {
  data: Employee[];
  loading: boolean;
  error?: string;
}

const initialState: State = {
  data: [],
  loading: false,
};


const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default employeesSlice.reducer;

// store/employees/selector.ts

// export const selectEmployees = (state: RootState) => state.employees;
