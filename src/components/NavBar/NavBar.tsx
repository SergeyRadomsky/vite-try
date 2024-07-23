import { useState, useEffect } from "react";
import { AppBar, Button, Toolbar, ButtonGroup } from "@mui/material";
import s from "./navbar.module.scss";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activePath, setActivePath] = useState(window.location.pathname);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogOut = () => {localStorage.removeItem('access-token')};

  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = "#333";
      document.body.style.color = "#fff";
    } else {
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handlePopState = () => {
      setActivePath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <>
      <AppBar style={{ backgroundColor: isDarkMode ? "#555" : "#3f51b5" }}>
        <Toolbar className={s.navbar}>
          <ButtonGroup>
            <a href="/stores">
              <Button
                variant="text"
                className={
                  activePath === "/stores" || activePath === "/"
                    ? s.activeNavBtn
                    : s.navBtn
                }
              >
                Stores
              </Button>
            </a>
            <a href="/employees">
              <Button
                variant="text"
                className={
                  activePath === "/employees" ? s.activeNavBtn : s.navBtn
                }
              >
                Employees
              </Button>
            </a>
            <a href="/products">
              <Button
                variant="text"
                className={
                  activePath === "/products" ? s.activeNavBtn : s.navBtn
                }
              >
                Products
              </Button>
            </a>
            <a href="/positions">
              <Button
                variant="text"
                className={
                  activePath === "/positions" ? s.activeNavBtn : s.navBtn
                }
              >
                Positions
              </Button>
            </a>
            <a href="/store-products">
              <Button
                variant="text"
                className={
                  activePath === "/store-products" ? s.activeNavBtn : s.navBtn
                }
              >
                Store products
              </Button>
            </a>
            <a href="/users">
              <Button
                variant="text"
                className={activePath === "/users" ? s.activeNavBtn : s.navBtn}
              >
                Users
              </Button>
            </a>
            <a href="/authorization">
              <Button
                variant="text"
                className={
                  activePath === "/authorization" ? s.activeNavBtn : s.navBtn
                }
              >
                authorization
              </Button>
            </a>
          </ButtonGroup>
          <Button variant="text" className={s.navBtn} onClick={toggleDarkMode}>
            {isDarkMode ? "Light mode" : "Dark mode"}
          </Button>

          <Button
            // type="submit"
            className={s.navBtn}
            onClick={handleLogOut}
            // variant="contained"
            color="primary"
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
