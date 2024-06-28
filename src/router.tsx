import { createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
// import Home from './pages/Home/Home';
import EmployeesTable from './components/tables/EmployeesTable/EmployeesTable';
import PositionsTable from './components/tables/PositionsTable/PositionsTable';
import ProductsTable from './components/tables/ProductsTable/ProductsTable';
import StoresTable from './components/tables/StoresTable/StoresTable';
import StoreProductsTable from './components/tables/StoreProductsTable/StoreProductTable';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // { path: '/', element: <StoresTable />},
      { path: '/employees', element: <EmployeesTable /> },
      { path: '/positions', element: <PositionsTable /> },
      { path: '/products', element: <ProductsTable /> },
      { path: '/stores', element: <StoresTable /> },
      { path: '/store-products', element: <StoreProductsTable /> },
      // { path: '/', element: <StoresTable /> },
    ],
  },
]);

export default router;




// // import React from 'react';
// import { createBrowserRouter } from 'react-router-dom';
// import Layout from './layout';
// // import Home from './pages/Home/Home';
// import DynamicTable from './components/DynamicTable/DynamicTable/DynamicTable';
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       { path: '/', element: <DynamicTable tableName="stores" /> },
//       { path: 'stores', element: <DynamicTable tableName="stores" /> },
//       { path: 'employees', element: <DynamicTable tableName="employees" /> },
//       { path: 'products', element: <DynamicTable tableName="products" /> },
//       { path: 'positions', element: <DynamicTable tableName="positions" /> },
//       { path: 'storeproduct', element: <DynamicTable tableName="storeproduct" /> },
//     ],
//   },
// ]);

// export default router;
