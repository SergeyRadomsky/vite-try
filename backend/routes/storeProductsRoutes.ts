import { Router } from 'express';
import { getStoreProducts, createStoreProduct, updateStoreProduct, deleteStoreProduct } from '../controllers/storeProductsControllers';

const router = Router();

router.get('/', getStoreProducts);
router.post('/', createStoreProduct);
router.put('/:id', updateStoreProduct);
router.delete('/:id', deleteStoreProduct);

export default router;
