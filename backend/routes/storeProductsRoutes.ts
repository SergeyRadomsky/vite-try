import { Router } from 'express';
import { getStoreProducts } from '../controllers/storeProductsControllers';

const router = Router();

router.get('/:storeid/products', getStoreProducts);

export default router;
