import { sequelize } from '../sequelize';
import { DataTypes, Model } from 'sequelize';

class User extends Model {
  public id!: number;
  public username!: string;
  public login!: string;
  public password!: string;
  public email!: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  tableName: 'users',
  timestamps: false, // Отключение временных меток
});

export default User;
