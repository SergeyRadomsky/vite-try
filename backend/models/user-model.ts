import { sequelize } from '../sequelize';
import { Model, DataTypes } from 'sequelize';

class User extends Model {
  public id!: number;
  public username!: string;
  public login!: string;
  public password!: string;
  public email!: string;
  public refreshToken!: string; // Новое поле
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      // allowNull: false,
    },
    login: {
      type: new DataTypes.STRING(128),
      // allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      // allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      // allowNull: false,
    },
    token: {
      type: new DataTypes.STRING(128),
      // allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'users',
    sequelize, 
  }
);

export default User;
