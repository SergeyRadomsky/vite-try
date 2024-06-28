import { Router } from 'express';
import { getStoreProducts } from '../controllers/storeProductsControllers';

const router = Router();

router.get('/', getStoreProducts);

export default router;
