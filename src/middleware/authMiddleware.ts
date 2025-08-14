import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized! Please signin first.",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET ?? "");

    if (!decode) {
      return res.status(401).json({
        message: "Unauthorized! Please signin first.",
      });
    }

    if (typeof decode === "object" && decode !== null && "userId" in decode) {
      req.userId = (decode as { userId?: string }).userId;
    }

    if (typeof decode === "object" && decode !== null && "userRole" in decode) {
      req.userRole = (decode as { userRole?: string }).userRole;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export default authMiddleware;
