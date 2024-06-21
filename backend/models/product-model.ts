import { sequelize } from './../sequelize';
import { DataTypes, Model } from 'sequelize';


class Product extends Model {}

Product.init({
  productid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'products',
  timestamps: false, // Отключение временных меток
});

export default Product;
