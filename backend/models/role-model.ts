import { sequelize } from '../sequelize';
import { DataTypes, Model } from 'sequelize';

class Role extends Model {
  id: number;
}

Role.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  tableName: 'roles',
  timestamps: false, // Отключение временных меток

});

export default Role;
