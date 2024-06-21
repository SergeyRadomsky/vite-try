// import { AppBar, Button, Toolbar, ButtonGroup} from "@mui/material";
// import s from "./Home.module.scss";

import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
    {/* <p>Home Page</p> */}
    <Outlet/>
    </>
  );
};

export default Home;
