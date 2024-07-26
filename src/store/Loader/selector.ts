import { RootState } from "../store";

export const SelectIsLoadingLoader = (state: RootState) => state.loader.isLoading;
export const selectLoadingError = (state: RootState) => state.loader.error;