import { sequelize } from './../sequelize';
import { DataTypes, Model } from 'sequelize';

class Employees extends Model {}

Employees.init({
  employeeid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
  },
  positionid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  storeid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bod: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'employees',
  timestamps: false, // Отключение временных меток
});

export default Employees;
