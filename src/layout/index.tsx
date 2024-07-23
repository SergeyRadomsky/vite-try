import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/NavBar/NavBar';

const Layout: FC = () => {

  localStorage.getItem('token')

  return (
    <div>
      <Navbar/>
      <Outlet />
    </div>
  );
};

export default Layout;