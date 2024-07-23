import { body } from 'express-validator';
import { Employees } from '../models';

export const employeeValidationRules = () => {
  return [
    body('firstname').isString().withMessage('Firstname should be a string'),
    body('lastname').isString().withMessage('Lastname should be a string'),
    body('surname').isString().withMessage('Surname should be a string'),
    body('bod').isISO8601().withMessage('Date of birth should be a valid date'),
    body('positionid').isInt({ min: 1 }).withMessage('Position ID should be a positive integer'),
    body('storeid').isInt({ min: 1 }).withMessage('Store ID should be a positive integer'),
    body('firstname').custom(async (value, { req }) => {
      const { firstname, lastname, surname, bod } = req.body;
      const existingEmployee = await Employees.findOne({
        where: {
          firstname,
          lastname,
          surname,
          bod,
        },
      });
      if (existingEmployee) {
        throw new Error('Employee with this full name and date of birth already exists1' );
      }
      return true;
    }),
  ];
};
