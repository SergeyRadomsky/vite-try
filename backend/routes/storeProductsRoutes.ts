import { Router } from 'express';
import { getStoreProducts, createStoreProduct, updateStoreProduct, deleteStoreProduct } from '../controllers/storeProductsControllers';
import authentication from '../middlewares/authentication';

const router = Router();

router.get('/', authentication, getStoreProducts);
router.post('/', authentication, createStoreProduct);
router.put('/:id',authentication,  updateStoreProduct);
router.delete('/:id', authentication, deleteStoreProduct);

export default router;
