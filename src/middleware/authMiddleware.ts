import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization ?? "";
  const decode = jwt.verify(token, process.env.JWT_SECRET || "123456");

  if (!decode) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }

  //@ts-ignore
  req.userId = decode.userId;
  next();
};
