import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';
import User from './user-model';
import Role from './role-model';

class UserRole extends Model {}

UserRole.init({
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
    field: 'user_id',
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id',
    },
    primaryKey: true,
    field: 'role_id',
  },
}, {
  sequelize,
  tableName: 'user_roles',
  timestamps: false, // Отключение временных меток
});

export default UserRole;
