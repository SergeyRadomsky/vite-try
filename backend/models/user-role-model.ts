import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';
import User from './user-model';
import Role from './role-model';

class UserRole extends Model {
  public userId!: number;
  public roleId!: number;
}

UserRole.init({
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id',
    },
    primaryKey: true,
  },
}, {
  sequelize,
  tableName: 'user_roles',
});

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

export default UserRole;
