// middlewares/tokenCheck.ts
import * as jwt from 'jsonwebtoken';

// const jwtSecret = 'your_jwt_secret'; // Лучше использовать переменные окружения

const authentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  console.log('hello');


  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
      100;
  });
};

export default authentication;
