import { Router } from 'express';
import { getStores, createStore, deleteStore, updateStore, getStoreEmployees } from '../controllers/storesController';

const router = Router();

router.get('/', getStores);
router.post('/', createStore);
router.delete('/:storeid', deleteStore);
router.put('/:storeid', updateStore);
router.get('/:identifier/employees', getStoreEmployees);

export default router;
