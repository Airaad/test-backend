import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../db/prisma";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import jwt from "jsonwebtoken";

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, role } = req.body;
  try {
    const alreadyUser = await prismaClient.user.findUnique({
      where: { username },
    });
    if (alreadyUser) {
      res.status(401).json({
        message: "This username already exists",
      });
    }
    const hashedPassword = await hashPassword(password);
    await prismaClient.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role,
      },
    });
    res.status(201).json({
      message: "Signup successfull!",
    });
  } catch (error) {
    res.status(501).json({
      message: "Something went wrong!",
    });
    console.log(error);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  try {
    const validUser = await prismaClient.user.findUnique({
      where: { username },
    });
    if (!validUser) {
      return res.status(404).json({
        message: "User not found! Please Register first",
      });
    }
    const validPassword = await comparePassword(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Incorrect credentials!",
      });
    }
    const userId = validUser.id;
    const userRole = validUser.role;
    const token = jwt.sign(
      {
        userId,
        userRole,
      },
      process.env.JWT_SECRET || "123456"
    );
    res.status(201).json({
      message: "Login successfull!",
      token,
    });
  } catch (error) {
    res.status(501).json({
      message: "Something went wrong!",
    });
    console.log(error);
  }
};
