import * as dotenv from 'dotenv';
dotenv.config();

import * as express from "express";
import * as bodyParser from "body-parser";
import employeesRoutes from "./routes/employeesRoutes";
import storesRoutes from "./routes/storesRoutes";
import positionsRoutes from "./routes/positionsRoutes";
import productsRoutes from "./routes/productsRoutes";
import storeProductsRoutes from "./routes/storeProductsRoutes";
import userRoutes from './routes/userRoutes'; // Новый маршрут для пользователей
import roleRoutes from './routes/roleRoutes'; // Новый маршрут для ролей
// import userRoleRoutes from './routes/userRoleRoutes';
import authRoutes from './routes/authRoutes'
 // Новый маршрут для user_roles
var cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions))

app.use(bodyParser.json());

// Подключаем маршруты
app.use("/employees", employeesRoutes);
app.use("/stores", storesRoutes);
app.use("/", storesRoutes);
app.use("/positions", positionsRoutes);
app.use("/products", productsRoutes);
app.use("/store-products", storeProductsRoutes);
app.use('/users', userRoutes); // Подключаем маршрут для пользователей
app.use('/roles', roleRoutes); // Подключаем маршрут для ролей
app.use("/auth", authRoutes)
// app.use('/user-roles', userRoleRoutes); // Подключаем маршрут для user_roles


app.listen(PORT, () => {
  // console.log('Loaded ENV variables:', process.env);
  console.log('Loaded ENV variables:', process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET);
  console.log(`Server is running on port ${PORT}`);
});
