import * as express from "express";
import * as bodyParser from "body-parser";
import employeesRoutes from "./routes/employeesRoutes";
import storesRoutes from "./routes/storesRoutes";
import positionsRoutes from "./routes/positionsRoutes";
import productsRoutes from "./routes/productsRoutes";
import storeProductsRoutes from "./routes/storeProductsRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Подключаем маршруты
app.use("/employees", employeesRoutes);
app.use("/stores", storesRoutes);
app.use("/", storesRoutes);
app.use("/positions", positionsRoutes);
app.use("/products", productsRoutes);
app.use("/store-products", storeProductsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
