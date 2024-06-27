// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './employees/reducer';

const store = configureStore({
  reducer: {
    employees: employeesReducer,
    // добавьте другие редюсеры по мере необходимости
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;


// import { configureStore } from '@reduxjs/toolkit';
// import tableReducer from './tableSlice';

// const store = configureStore({
//   reducer: {
//     table: tableReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// export default store;
