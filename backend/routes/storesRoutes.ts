import { Router } from 'express';
import { getStores, createStore, updateStore, deleteStore } from '../controllers/storesController';

const router = Router();

router.get('/', getStores);
router.post('/stores', createStore);
router.put('/:id', updateStore);
router.delete('/:id', deleteStore);

export default router;
