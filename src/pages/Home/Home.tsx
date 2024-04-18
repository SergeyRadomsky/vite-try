import { Button, Card, Checkbox, Input } from "@mui/material";
import s from "./Home.module.scss";
import { useState } from "react";
import { Form } from "react-router-dom";

const Home = () => {
  const [value, setValue] = useState("");

  const HandleChange = (event) => {
    setValue(event.target.value);
  };

  const HandleSubmit = (event) => {
    event.preventDefault();
    setValue("");
    console.log("fuck");
  };

  return (
    <>
      <Form>
        <Input id="todo-input" onChange={HandleChange} onSubmit={HandleSubmit}>
          {value}
        </Input>
        <Button variant="contained" o onClick={HandleSubmit}>
          add
        </Button>
      </Form>
      <div>
        <Card variant="outlined" className={s.Task}>
          <Checkbox></Checkbox>
          <p>task</p>
          {/* <TextField variant="standart"/> */}
          <Button variant="contained">X</Button>
        </Card>
      </div>
    </>
  );
};

export default Home;
