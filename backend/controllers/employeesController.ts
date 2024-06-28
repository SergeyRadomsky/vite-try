// controllers/employeesController.ts
import { Request, Response } from "express";
import { Employees, Positions, Stores } from "../models";

// Получение всех сотрудников с названиями магазинов и должностей
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;

    const { rows: employees, count } = await Employees.findAndCountAll({
      include: [
        { model: Positions, as: "position", attributes: ["positionname"] },
        { model: Stores, as: "store", attributes: ["storename"] },
      ],
      limit,
      offset,
    });

    res.json({
      data: employees,
      count,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send("Server Error");
  }
};

// Создание нового сотрудника
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const newEmployee = await Employees.create(req.body);
    res.json(newEmployee);
  } catch (error) {
    res.status(400).json({ error: "Validation Error" });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { employeeid } = req.params;
    await Employees.update(req.body, {
      where: { employeeid },
      returning: true,
    });

    const updatedEmployee = await Employees.findByPk(employeeid, {
      include: [{ association: "position" }, { association: "store" }],
    });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: "Validation Error" });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { employeeid } = req.params;
    await Employees.destroy({ where: { employeeid } });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
