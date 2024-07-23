// store/users/selectors.ts
import { RootState } from '../../store/store';

export const selectUsers = (state: RootState) => state.users.data;
export const selectUserRoles = (state: RootState) => state.users.data.map(user => user.roles).flat();
