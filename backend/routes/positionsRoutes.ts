import { Router } from 'express';
import { getPositions, createPosition, deletePosition, updatePosition } from '../controllers/positionsController';

const router = Router();

router.get('/', getPositions);
router.post('/', createPosition);
router.delete('/:id', deletePosition);
router.put('/:id', updatePosition);

export default router;
