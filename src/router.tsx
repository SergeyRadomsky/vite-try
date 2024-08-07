import { createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
// import Home from './pages/Home/Home';
import EmployeesTable from './components/tables/EmployeesTable/EmployeesTable';
import PositionsTable from './components/tables/PositionsTable/PositionsTable';
import ProductsTable from './components/tables/ProductsTable/ProductsTable';
import StoresTable from './components/tables/StoresTable/StoresTable';
import StoreProductsTable from './components/tables/StoreProductsTable/StoreProductTable';
import PositionEdit from './components/tables/PositionEdit/PositionEdit';
import UserTable from './components/tables/UserTable/UserTable';
import AuthForm from './components/Auth/AuthForm';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // { path: '/', element: <StoresTable />},
      { path: '/employees', element: <EmployeesTable /> },
      { path: '/positions', element: <PositionsTable /> },
      { path: '/positions/edit/:id', element: <PositionEdit /> }, 
      { path: '/products', element: <ProductsTable /> },
      { path: '/stores', element: <StoresTable /> },
      { path: '/store-products', element: <StoreProductsTable /> },
      { path: '/users', element: <UserTable /> },
      { path: '/authorization', element: <AuthForm isLogin={false} /> },
      // { path: '/authorization', element: <AuthForm isLogin={false} /> },
      // { path: '/authorization', element: <AuthForm isLogin={} /> },
    ],
  },
]);

export default router;


