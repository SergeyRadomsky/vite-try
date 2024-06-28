import React, { useState, useEffect } from 'react';
import { AppBar, Button, Toolbar, ButtonGroup } from "@mui/material";
import s from "./navbar.module.scss";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#333';
      document.body.style.color = '#fff';
    } else {
      document.body.style.backgroundColor = '#fff';
      document.body.style.color = '#000';
    }
  }, [isDarkMode]);

  return (
    <>
      <AppBar style={{ backgroundColor: isDarkMode ? '#555' : '#3f51b5' }}>
        <Toolbar className={s.navbar}>
          <ButtonGroup>
            <a href="/stores"> <Button variant="text" className={s.navBtn}>Stores</Button></a>
            <a href="/employees"> <Button variant="text" className={s.navBtn}>Employees</Button></a>
            <a href="/products"> <Button variant="text" className={s.navBtn}>Products</Button></a>
            <a href="/positions"> <Button variant="text" className={s.navBtn}>Positions</Button></a>
            <a href="/store-products"> <Button variant="text" className={s.navBtn}>Store products</Button></a>
          </ButtonGroup>
          <Button variant="text" className={s.navBtn} onClick={toggleDarkMode}>
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
