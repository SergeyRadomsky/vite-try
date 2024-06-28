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
}, {
  sequelize,
  modelName: 'positions',
  timestamps: false, // Отключение временных меток
});

export default Position;
