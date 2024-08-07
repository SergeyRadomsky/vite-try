// store/employees/reducer.tsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchWithAuth from '../../utils/fetchWithAuth';
// import { RootState } from '../../store/employees/selector';


export interface Employee {
  employeeid: number;
  firstname: string;
  lastname: string;
  surname: string;
  positionid: number;
  storeid: number;
  bod: any;
  position: { id: number; positionname: string };
  store: { id: number; storename: string };
}
export type CreateEmployee = {
  employeeid: number;
  firstname: string;
  lastname: string;
  surname: string;
  positionid: number;
  storeid: number;
  bod: string;
  position: { id: number; positionname: string };
  store: { id: number; storename: string };
}

// export interface Position {
//   positionname: string;
// }

// export interface Store {
//   storename: string;
// }

interface State {
  data: {
    data: Employee[];
    count: number;
  };
  loading: boolean;
  error?: string;
}

const initialState: State = {
  data: {
    data: [],
    count: 0,
  },
  loading: false,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (params: { limit: number; offset: number }) => {
    const { limit, offset } = params;
    const response = await fetchWithAuth(`/api/employees?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data;
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employee: Omit<Employee, 'employeeid' | 'position' | 'store'>, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({ message: 'An unexpected error occurred.' });
    }
  }
);

export const updateEmployee = createAsyncThunk('employees/updateEmployee', async (employee: Partial<Employee>) => {
  const response = await fetchWithAuth(`/api/employees/${employee.employeeid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employee),
  });
  const data = await response.json();
  return data;
});

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (employeeid: number) => {
  await fetchWithAuth(`/api/employees/${employeeid}`, {
    method: 'DELETE',
  });
  return employeeid;
});


const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        console.log('pending');
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        console.log('fulfilled');
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        console.log('rejected');
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.data.data.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.data.data.findIndex((employee) => employee.employeeid === action.payload.employeeid);
        if (index !== -1) {
          state.data.data[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.data.data = state.data.data.filter((employee) => employee.employeeid !== action.payload);
      });
  },
});

export default employeesSlice.reducer;
