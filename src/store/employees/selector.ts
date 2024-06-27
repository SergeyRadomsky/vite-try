import { RootState } from "../store";

export const selectEmployees = (state: RootState) => state.employees.data;
export const selectEmployeesLoading = (state: RootState) => state.employees.loading;
export const selectEmployeesError = (state: RootState) => state.employees.error;
