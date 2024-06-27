import { Request, Response } from 'express';
import { Stores, Employees } from '../models';

// Получение всех магазинов
export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await Stores.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Создание нового магазина
export const createStore = async (req: Request, res: Response) => {
  try {
    const newStore = await Stores.create(req.body);
    res.json(newStore);
  } catch (error) {
    res.status(400).json({ error: 'Validation Error' });
  }
};

// Удаление магазина
export const deleteStore = async (req: Request, res: Response) => {
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
};

// Редактирование магазина
export const updateStore = async (req: Request, res: Response) => {
  const { storeid } = req.params;
  try {
    const store = await Stores.findByPk(storeid);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    await store.update(req.body);
    res.json(store);
  } catch (error) {
    res.status(400).json({ error: 'Validation Error' });
  }
};

// Получение сотрудников магазина по ID или названию магазина
export const getStoreEmployees = async (req: Request, res: Response) => {
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
};
