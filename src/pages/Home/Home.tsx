import { Button, Card, Checkbox, Input } from "@mui/material";
import s from "./Home.module.scss";
const Home = () => {
  return (
    <>
      <Input id="todo-input"></Input>
      <Button variant="contained">add</Button>
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
