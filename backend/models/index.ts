import Stores from './store-model';
import Employees from './employee-model';
import Positions from './position-model';
import Products from './product-model';
import StoresProducts from './storeproduct-model';
import User from './user-model';
import Role from './role-model';
import UserRole from './user-role-model';

// Определение связей между моделями
Stores.hasMany(Employees, { foreignKey: 'storeid' });
Employees.belongsTo(Stores, { foreignKey: 'storeid', as: "store" });

Positions.hasMany(Employees, { foreignKey: 'positionid' });
Employees.belongsTo(Positions, { foreignKey: 'positionid' });

Stores.belongsToMany(Products, { through: StoresProducts, foreignKey: 'storeid' });
Products.belongsToMany(Stores, { through: StoresProducts, foreignKey: 'productid' });

StoresProducts.belongsTo(Products, { foreignKey: 'productid', as: 'product' });
StoresProducts.belongsTo(Stores, { foreignKey: 'storeid', as: 'store' });

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

export { Stores, Employees, Positions, Products, StoresProducts };
