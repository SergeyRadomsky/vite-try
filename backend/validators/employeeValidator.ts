import { body } from 'express-validator';

export const employeeValidationRules = () => {
  return [
    body('firstname').isString().withMessage('Firstname should be a string'),
    body('lastname').isString().withMessage('Lastname should be a string'),
    body('surname').isString().withMessage('Surname should be a string'),
    body('bod').isDate().withMessage('Date of birth should be a valid date'),
    body('positionid').isInt({ min: 1 }).withMessage('Position ID should be a positive integer'),
    body('storeid').isInt({ min: 1 }).withMessage('Store ID should be a positive integer')
  ];
}