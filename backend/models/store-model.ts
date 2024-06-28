import { sequelize } from "./../sequelize";
import { Model, DataTypes } from "sequelize";

class Store extends Model {}

Store.init(
  {
    storeid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    storename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    directorid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "stores",
    timestamps: false, // Отключение временных меток
  }
);

export default Store;
