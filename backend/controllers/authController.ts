import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { body, check, validationResult } from "express-validator";
import User from "../models/user-model";
import Role from "../models/role-model";
import UserRole from "../models/user-role-model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Регистрация
export const registerUser = [
  // Валидация полей и проверка существования username и email
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .custom(async (username) => {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error("Username already exists");
      }
    }),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (email) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("Email already exists");
      }
    }),
  body("password").notEmpty().withMessage("Password is required"),
  body("roles")
    .isArray({ min: 1 })
    .withMessage("At least one role is required"),

  // Обработчик запроса
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, roles } = req.body;

    try {
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

      const token = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
          // expiresIn: "5s",
        }
      );

      res.status(201).json({ token, userId: user.id });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ msg: "Error registering user" });
    }
  },
];


export const loginUser = [
  body("email").isEmail().withMessage("Invalid email address"),
  check("email").custom(async (email, { req }) => {
    if (!validationResult(req).isEmpty()) {
      // Skip this check if there are already errors
      return;
    }
    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      throw new Error("Email no exists");
    }
  }),
  body("password").notEmpty().withMessage("Password is required"),

  // Обработчик запроса
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(401)
          .json({
            errors: [
              { msg: "Invalid email", param: "email", location: "body" },
            ],
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({
            errors: [
              { msg: "Invalid password", param: "password", location: "body" },
            ],
          });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token, userId: user.id });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ msg: "Error logging in user" });
    }
  },
];
