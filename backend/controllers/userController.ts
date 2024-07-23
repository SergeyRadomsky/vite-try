import { Request, Response } from 'express';
import User from '../models/user-model';
import Role from '../models/role-model';
import UserRole from '../models/user-role-model';

// Создать нового пользователя
export const createUser = async (req: Request, res: Response) => {
  const { username, email, Roles } = req.body;
  try {
    const user = await User.create({ username, email });
    if (Roles) {
      const roleInstances = await Role.findAll({
        where: {
          id: Roles.map((role: any) => role.id)
        }
      });

      await UserRole.bulkCreate(roleInstances.map((role) => {
        return {
          userId: user.id,
          roleId: role.dataValues.id,
        };
      }));
      // await UserRole.bulkCreate([{ userId: user.id, roleId: roleInstances[0].dataValues.id }]);
    }

    await user.reload({ include: ['Roles'] });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email'],
      include: [
        {
          model: Role,
          attributes: ['id', 'role'],
          through: { attributes: [] } // Отключение атрибутов из таблицы связей
        }
      ]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};


// Пример кода для обновления пользователя на стороне сервера
export const updateUser = async (req: Request, res: Response) => {
  const { id, username, email, Roles } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    user.email = email;

    await user.save();

    if (Roles) {
      // Найти текущие роли пользователя
      const currentRoles = await UserRole.findAll({ where: { userId: user.id } });

      const currentRoleIds = currentRoles.map((userRole) => userRole.dataValues.roleId);
      const newRoleIds = Roles.map((role: any) => role.id);

      // Определить роли, которые нужно добавить
      const rolesToAdd = newRoleIds.filter((roleId) => !currentRoleIds.includes(roleId));

      // Определить роли, которые нужно удалить
      const rolesToRemove = currentRoleIds.filter((roleId) => !newRoleIds.includes(roleId));

      // Добавить новые роли
      if (rolesToAdd.length > 0) {
        await UserRole.bulkCreate(
          rolesToAdd.map((roleId) => ({ userId: user.id, roleId }))
        );
      }

      // Удалить старые роли
      if (rolesToRemove.length > 0) {
        await UserRole.destroy({
          where: {
            userId: user.id,
            roleId: rolesToRemove
          }
        });
      }
      // await UserRole.update()
    }

    await user.reload({ include: ['Roles'] });
    const { password, login, token, ...rest } = user.dataValues;
    res.json(rest);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Удалить пользователя
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Удалить все записи в UserRole, связанные с этим пользователем
    await UserRole.destroy({ where: { userId: user.id } });

    // Теперь удалить пользователя
    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
};