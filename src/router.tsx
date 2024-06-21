// import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
// import Home from './pages/Home/Home';
import DynamicTable from './components/DynamicTable/DynamicTable/DynamicTable';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <DynamicTable tableName="stores" /> },
      { path: 'stores', element: <DynamicTable tableName="stores" /> },
      { path: 'employees', element: <DynamicTable tableName="employees" /> },
      { path: 'products', element: <DynamicTable tableName="products" /> },
      { path: 'positions', element: <DynamicTable tableName="positions" /> },
    ],
  },
]);

export default router;
