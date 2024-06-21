import { sequelize } from './../sequelize';
import { DataTypes, Model } from 'sequelize';

class Positions extends Model {}

Positions.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  positionname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'positions',
  timestamps: false, // Отключение временных меток
});

export default Positions;
