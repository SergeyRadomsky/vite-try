import { Request, Response } from 'express';
import { Products } from '../models';

// Получение всех продуктов
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Products.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Создание нового продукта
export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await Products.create(req.body);
    res.json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Validation Error' });
  }
};

// Удаление продукта
export const deleteProduct = async (req: Request, res: Response) => {
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
};

// Редактирование продукта
export const updateProduct = async (req: Request, res: Response) => {
  const { productid } = req.params;
  try {
    const product = await Products.findByPk(productid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Validation Error' });
  }
};
