// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './employees/reducer';
import positionsReducer from './positions/reducer';
import productsReducer from './products/reducer';
import storesReducer from './stores/reducer';
import storesProductsReducer from './storeproducts/reducer';
import usersReducer from './users/reducer';
import rolesReducer from './roles/reducer';
import authReducer from './Auth/reducer';

const store = configureStore({
  reducer: {
    employees: employeesReducer,
    positions: positionsReducer,
    products: productsReducer,
    stores: storesReducer,
    storeproducts: storesProductsReducer,
    users: usersReducer,
    roles: rolesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
