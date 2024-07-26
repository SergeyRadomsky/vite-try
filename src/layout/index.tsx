import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/NavBar/NavBar';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Layout: FC = () => {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  return (
    <div>
      <Navbar/>
      {isLoading ? <div>Loading...</div> : <Outlet />}
    </div>
  );
};

export default Layout;