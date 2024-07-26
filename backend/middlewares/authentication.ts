// middlewares/tokenCheck.ts
import * as jwt from "jsonwebtoken";

// const jwtSecret = 'your_jwt_secret'; // Лучше использовать переменные окружения

const authentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const envToken =  process.env.ACCESS_TOKEN_SECRET;
  if (token == null) return res.sendStatus(401);
  console.log("envToken  ", envToken);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(token);
      console.log(process.env.ACCESS_TOKEN_SECRET);
      console.log(err);
      
      return res.sendStatus(403);      
    }
    req.user = user;
    next();
    100;
  });
};

export default authentication;