import { Router } from 'express';
import { getStores, createStore, updateStore, deleteStore } from '../controllers/storesController';
import authentication from '../middlewares/authentication';

const router = Router();

router.get('/', authentication, getStores);
router.post('/stores', authentication, createStore);
router.put('/:id', authentication, updateStore);
router.delete('/:id', authentication, deleteStore);

export default router;
