import { RootState } from "../store";


export const selectAllPositions = (state: RootState) => state.positions.data;
export const selectPositionsLoading = (state: RootState) => state.positions.loading;
export const selectPositionsError = (state: RootState) => state.positions.error;