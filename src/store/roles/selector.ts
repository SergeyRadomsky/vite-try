import { RootState } from '../../store/store';

export const selectUserRoles = (state: RootState) => state.roles.data;
export const selectRolesLoading = (state: RootState) => state.roles.loading;
export const selectRolesError = (state: RootState) => state.roles.error;
