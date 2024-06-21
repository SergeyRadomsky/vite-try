import { sequelize } from '../sequelize';
import { DataTypes, Model } from 'sequelize';

class StoreProducts extends Model {}

StoreProducts.init({
  storeid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Store',
      key: 'storeid',
    },
  },
  productid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Product',
      key: 'productid',
    },
  },
}, {
  sequelize,
  modelName: 'storeproducts',
  timestamps: false, // Отключение временных меток
});

export default StoreProducts;
