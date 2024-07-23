import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/user-model";
import Role from "../models/role-model";
import UserRole from "../models/user-role-model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Регистрация
export const registerUser = async (req: Request, res: Response) => {
  await body("username").notEmpty().run(req);
  // await body("email").isEmail().run(req);
  // await body("password").notEmpty().run(req);
  // await body("Roles").notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, roles } = req.body;
  
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (roles && roles.length > 0) {
      const roleInstances = await Role.findAll({
        where: {
          id: roles,
        },
      });

      await UserRole.bulkCreate(
        roleInstances.map((role) => ({
          userId: user.id,
          roleId: role.id,
        }))
      );
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, userId: user.id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Логин
export const loginUser = async (req: Request, res: Response) => {
  // await body("password").notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user.id });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user" });
  }
};
