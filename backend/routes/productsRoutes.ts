import { Router } from 'express';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../controllers/productController';
import authentication from '../middlewares/authentication';

const router = Router();

router.get('/', authentication, getProducts);
router.post('/', authentication, createProduct);
router.delete('/:productid', authentication, deleteProduct);
router.put('/:productid', authentication, updateProduct);

export default router;
