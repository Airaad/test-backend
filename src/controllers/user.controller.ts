import { Request, Response } from "express";
import { prismaClient } from "../db/prisma";

export const changeRole = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const validUser = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!validUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (validUser.role === "host") {
      return res.status(401).json({
        message: "You are already a host",
      });
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: validUser.id },
      data: { role: "host" },
    });

    res.status(200).json({
      message: "Role changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
