import { NextFunction, Request, Response } from "express";

const hostMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRole = req.userRole;
  if (userRole === "regular") {
    return res.status(401).json({
      message: "You are not host!",
    });
  }
  next();
};

export default hostMiddleware;
