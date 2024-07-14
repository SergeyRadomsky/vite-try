import { sequelize } from './../sequelize';
import { DataTypes, Model } from 'sequelize';

class Position extends Model {}

Position.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  positionname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salarycoeff: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'positions',
  timestamps: false, // Отключение временных меток
});

export default Position;
