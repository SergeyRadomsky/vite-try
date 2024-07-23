import { Request, Response } from 'express';
import Role from '../models/role-model';
// import User from '../models/user-model';
// import UserRole from '../models/user-role-model';


export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};