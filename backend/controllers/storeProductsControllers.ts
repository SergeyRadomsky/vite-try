import { Request, Response } from 'express';
import { StoresProducts, Products, Stores } from '../models';

// Получение продуктов в магазине
export const getStoreProducts = async (req: Request, res: Response) => {
  const { storeid } = req.params;
  try {
    const storeProducts = await StoresProducts.findAll({ where: { storeid }, include: Products });
    res.json(storeProducts);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
