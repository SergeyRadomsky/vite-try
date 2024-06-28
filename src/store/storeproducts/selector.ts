import { RootState } from '../../store/store';

export const selectStoreProducts = (state: RootState) => state.storeproducts.data;
export const selectStores = (state: RootState) => state.stores.data;
export const selectProducts = (state: RootState) => state.products.data;
