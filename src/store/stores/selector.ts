import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectStores = (state: RootState) => state.stores.data;

export const selectFilteredStores = createSelector(
  [selectStores, (state: RootState, filters: { storename: string; directorid: string }) => filters],
  (stores, filters) => {
    return stores.filter((store) => {
      return (
        (!filters.storename || store.storename.includes(filters.storename)) &&
        (!filters.directorid || store.directorid.toString() === filters.directorid)
      );
    });
  }
);
