import { Request, Response } from 'express';
import { Stores, Products, StoresProducts } from '../models';

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
