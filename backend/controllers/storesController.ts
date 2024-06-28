import { Request, Response } from 'express';
import Store from '../models/store-model';

export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const store = await Store.create(req.body);
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create store' });
  }
};

export const updateStore = async (req: Request, res: Response) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    await store.update(req.body);
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update store' });
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    await store.destroy();
    res.json({ message: 'Store deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete store' });
  }
};
