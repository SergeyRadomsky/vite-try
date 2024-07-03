import { Request, Response } from 'express';
import { Stores, Products, StoresProducts } from '../models';

// Получение всех записей StoreProducts с фильтрацией
export const getStoreProducts = async (req: Request, res: Response) => {
  try {
    const { storeId, productId } = req.query;
    const query: any = {};

    if (storeId) query.storeid = storeId;
    if (productId) query.productid = productId;

    const storeProducts = await StoresProducts.findAll({
      where: query,
      include: [
        { model: Stores, as: 'store', attributes: ['storename'] },
        { model: Products, as: 'product', attributes: ['productname'] },
      ],
    });
    res.json(storeProducts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

// Создание новой записи StoreProduct
export const createStoreProduct = async (req: Request, res: Response) => {
  try {
    const { storeid, productid } = req.body;
    const newStoreProduct = await StoresProducts.create({ storeid, productid });
    res.json(newStoreProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

// Обновление существующей записи StoreProduct
export const updateStoreProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { storeid, productid } = req.body;

    await StoresProducts.update(
      { storeid, productid },
      { where: { id } }
    );

    const updatedStoreProduct = await StoresProducts.findByPk(id, {
      include: [
        { model: Stores, as: 'store', attributes: ['storename'] },
        { model: Products, as: 'product', attributes: ['productname'] },
      ],
    });

    res.json(updatedStoreProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

// Удаление записи StoreProduct
export const deleteStoreProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await StoresProducts.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};
