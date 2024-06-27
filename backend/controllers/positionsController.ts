import { Request, Response } from 'express';
import { Positions } from '../models';

// Получение всех ролей
export const getPositions = async (req: Request, res: Response) => {
  try {
    const positions = await Positions.findAll();
    res.json(positions);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Создание новой роли
export const createPosition = async (req: Request, res: Response) => {
  try {
    const newPosition = await Positions.create(req.body);
    res.json(newPosition);
  } catch (error) {
    res.status(400).json({ error: 'Validation Error' });
  }
};

// Удаление роли
export const deletePosition = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const position = await Positions.findByPk(id);
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    await position.destroy();
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Редактирование роли
export const updatePosition = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const position = await Positions.findByPk(id);
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    await position.update(req.body);
    res.json(position);
  } catch (error) {
    res.status(400).json({ error: 'Validation Error' });
  }
};
