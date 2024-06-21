import * as express from "express";
// import * as bcrypt from "bcrypt";
// import * as path from "path";
import * as bodyParser from "body-parser";

// const bootstrap = async () => {
//   // await User.sync({ force: true });
//   // await Article.sync({ force: true });
//   // await Comment.sync({ force: true });
//   // await User.sync();
//   // await Article.sync();
//   // await Comment.sync();
// };
// bootstrap();

// const PORT = process.env.PORT ?? 3001;
// const app = express();
// app.use(bodyParser.json());

// const jwt = require("jsonwebtoken");

import { body, validationResult } from 'express-validator';
import { Stores, Employees, StoresProducts, Products, Positions } from './models';

const PORT = process.env.PORT ?? 3001;
const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Маршрут для создания магазина с валидацией
app.post(
  '/stores',
  [
    body('storename').isString().notEmpty(),
    body('address').isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const store = await Stores.create(req.body);
      res.json(store);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

// Маршрут для получения всех магазинов
app.get('/stores', async (req, res) => {
  try {
    const stores = await Stores.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для получения всех сотрудников
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employees.findAll();
    res.json(employees);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для получения всех продуктов
app.get('/products', async (req, res) => {
  try {
    const products = await Products.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для получения сотрудников магазина по ID или названию магазина
app.get('/stores/:identifier/employees', async (req, res) => {
  const { identifier } = req.params;
  try {
      let store;
      const numericIdentifier = parseInt(identifier, 10);

      if (isNaN(numericIdentifier)) {
          // Если идентификатор не число, ищем по названию
          store = await Stores.findOne({ where: { storename: identifier } });
      } else {
          // Если идентификатор число, ищем по ID
          store = await Stores.findOne({ where: { storeid: numericIdentifier } });
      }

      if (!store) {
          return res.status(404).send('Store not found');
      }

      const employees = await Employees.findAll({ where: { storeid: store.storeid } });
      res.json(employees);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

// Маршрут для получения продуктов в магазине
app.get('/stores/:storeid/products', async (req, res) => {
  const { storeid } = req.params;
  try {
    const storeProducts = await StoresProducts.findAll({ where: { storeid }, include: Products });
    res.json(storeProducts);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для создания сотрудника
app.post(
  '/employees',
  [
    body('firstname').isString().notEmpty(),
    body('lastname').isString().notEmpty(),
    body('positionid').isInt().notEmpty(),
    body('storeid').isInt().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const employee = await Employees.create(req.body);
      res.json(employee);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

// Маршрут для создания продукта
app.post(
  '/products',
  [
    body('productname').isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = await Products.create(req.body);
      res.json(product);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

// Маршрут для получения всех ролей
app.get('/positions', async (req, res) => {
  try {
    const positions = await Positions.findAll();
    res.json(positions);
  } catch (error) {
    console.error(error); // Вывод ошибки в консоль для отладки
    res.status(500).send('Server Error 123q');
  }
});

// Маршрут для создания новой роли
app.post(
  '/positions',
  [
    body('positionname').isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const position = await Positions.create(req.body);
      res.json(position);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

// Маршрут для удаления сотрудника
app.delete('/employees/:employeeid', async (req, res) => {
  const { employeeid } = req.params;
  try {
    const employee = await Employees.findByPk(employeeid);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для удаления роли
app.delete('/positions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const position = await Positions.findByPk(id);
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    await position.destroy();
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для удаления магазина
app.delete('/stores/:storeid', async (req, res) => {
  const { storeid } = req.params;
  try {
    const store = await Stores.findByPk(storeid);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    await store.destroy();
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для удаления продукта
app.delete('/products/:productid', async (req, res) => {
  const { productid } = req.params;
  try {
    const product = await Products.findByPk(productid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});


// Маршрут для редактирования магазина
app.put('/stores/:storeid', [
  body('storename').optional().isString().notEmpty(),
  body('address').optional().isString().notEmpty(),
  body('directorid').optional().isInt(),
], async (req, res) => {
  const { storeid } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const store = await Stores.findByPk(storeid);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    await store.update(req.body);
    res.json(store);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для редактирования сотрудника
app.put('/employees/:employeeid', [
  body('firstname').optional().isString().notEmpty(),
  body('lastname').optional().isString().notEmpty(),
  body('middlename').optional().isString(),
  body('positionid').optional().isInt().notEmpty(),
  body('storeid').optional().isInt().notEmpty(),
], async (req, res) => {
  const { employeeid } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const employee = await Employees.findByPk(employeeid);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await employee.update(req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для редактирования роли
app.put('/positions/:id', [
  body('positionname').optional().isString().notEmpty(),
], async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const position = await Positions.findByPk(id);
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    await position.update(req.body);
    res.json(position);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Маршрут для редактирования продукта
app.put('/products/:productid', [
  body('productname').optional().isString().notEmpty(),
], async (req, res) => {
  const { productid } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Products.findByPk(productid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});