import { Request, Response } from "express";
import { prismaClient } from "../db/prisma";
import { bookingSchema } from "../utils/zodTypes";
import z from "zod";

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

export const bookListing = async (req: Request, res: Response) => {
  const placeId = req.params.id;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized. Please sign in again",
    });
  }
  const validatedData = bookingSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res.status(403).json({
      message: z.prettifyError(validatedData.error),
    });
  }
  const { startDate, endDate } = validatedData.data;

  try {
    // To check if place is already booked
    const overlappingBooking = await prismaClient.booking.findFirst({
      where: {
        placeId,
        status: "confirmed",
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: "This place is already booked for the selected dates.",
      });
    }

    // To check if user already booked the same place
    const userDoubleBooking = await prismaClient.booking.findFirst({
      where: {
        userId,
        placeId,
        status: "confirmed",
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });

    if (userDoubleBooking) {
      return res.status(400).json({
        message: "You already have a booking for this place on these dates.",
      });
    }

    const booking = await prismaClient.booking.create({
      data: {
        userId,
        placeId,
        startDate,
        endDate,
        status: "confirmed",
      },
    });
    return res.status(201).json({
      message: "Booking successful!",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized. Please sign in again",
    });
  }
  try {
    const bookedPlace = await prismaClient.booking.findUnique({
      where: {
        id: bookingId,
        userId,
      },
    });
    if (!bookedPlace || bookedPlace.status === "cancelled") {
      return res.status(404).json({
        message: "No booking found",
      });
    }
    const canceled = await prismaClient.booking.update({
      where: { id: bookedPlace.id },
      data: { status: "cancelled" },
    });

    res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized. Please sign in again",
    });
  }
  try {
    const userBookings = await prismaClient.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.status(201).json({
      userBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
