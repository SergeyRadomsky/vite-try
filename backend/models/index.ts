import Stores from './store-model';
import Employees from './employee-model';
import Positions from './position-model';
import Products from './product-model';
import StoresProducts from './storeproduct-model';

// Определение связей между моделями
Stores.hasMany(Employees, { foreignKey: 'storeid' });
Employees.belongsTo(Stores, { foreignKey: 'storeid' });

Positions.hasMany(Employees, { foreignKey: 'positionid' });
Employees.belongsTo(Positions, { foreignKey: 'positionid' });

Stores.belongsToMany(Products, { through: StoresProducts, foreignKey: 'storeid' });
Products.belongsToMany(Stores, { through: StoresProducts, foreignKey: 'productid' });

export { Stores, Employees, Positions, Products, StoresProducts };
