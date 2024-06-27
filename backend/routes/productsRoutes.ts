import { Router } from 'express';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.delete('/:productid', deleteProduct);
router.put('/:productid', updateProduct);

export default router;
