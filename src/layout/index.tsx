import { FC } from 'react';
import { Outlet } from 'react-router-dom';
// import Home from '../pages/Home/Home';
import Navbar from '../components/NavBar/NavBar';
// import classNames from 'classnames';
// import s from '../App.module.scss';
// import Home from '../pages/Home/Home';

const Layout: FC = () => {

  // const theme = useAppSelector(themeSelector);

  return (
    <div
      // className={classNames(s.App, {
      //   [s.dark]: theme === ThemeVariants.dark,
      //   [s.light]: theme === ThemeVariants.light,
      // })}
    >
      <Navbar/>
      {/* <Home /> */}
      <Outlet />
    </div>
  );
};

export default Layout;