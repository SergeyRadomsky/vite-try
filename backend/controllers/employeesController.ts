// controllers/employeesController.ts
import { Request, Response } from 'express';
import { Employees, Positions, Stores } from '../models';

// Получение всех сотрудников с названиями магазинов и должностей
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employees.findAll({
      include: [
        { model: Positions, as: 'position', attributes: ['positionname'] },
        { model: Stores, as: 'store', attributes: ['storename'] },
      ],
    });
    res.json(employees);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// Создание нового сотрудника
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const newEmployee = await Employees.create(req.body);
    res.json(newEmployee);
  } catch (error) {
    res.status(400).json({ error: 'Validation Error' });
  }
};
