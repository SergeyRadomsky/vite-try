import { sequelize } from './../sequelize';
import { DataTypes, Model } from 'sequelize';

class Stores extends Model {}

Stores.init({
  storeid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  storename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  directorid: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: 'stores',
  timestamps: false, // Отключение временных меток
});

export default Stores;
