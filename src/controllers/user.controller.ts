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

  // Validate date logic
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (start >= end) {
    return res.status(400).json({
      message: "End date must be after start date",
    });
  }

  if (start < now) {
    return res.status(400).json({
      message: "Booking start date cannot be in the past",
    });
  }

  try {
    const place = await prismaClient.listing.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    // To check if place is already booked
    const overlappingBooking = await prismaClient.booking.findFirst({
      where: {
        placeId, // Same place
        status: {
          in: ["pending", "confirmed"], // Only active bookings (not cancelled)
        },
        OR: [
          // ANY of these 4 conditions = overlap
          // Condition 1: New starts during existing
          {
            AND: [{ startDate: { lte: start } }, { endDate: { gt: start } }],
          },
          // Condition 2: New ends during existing
          {
            AND: [{ startDate: { lt: end } }, { endDate: { gte: end } }],
          },
          // Condition 3: New contains existing
          {
            AND: [{ startDate: { gte: start } }, { endDate: { lte: end } }],
          },
          // Condition 4: Existing contains new
          {
            AND: [{ startDate: { lte: start } }, { endDate: { gte: end } }],
          },
        ],
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (overlappingBooking) {
      const isOwnBooking = overlappingBooking.userId === userId;

      if (isOwnBooking) {
        return res.status(400).json({
          message:
            "You already have a booking for this place during these dates.",
          details: {
            existingBooking: {
              id: overlappingBooking.id,
              startDate: overlappingBooking.startDate,
              endDate: overlappingBooking.endDate,
              status: overlappingBooking.status,
            },
          },
        });
      } else {
        return res.status(400).json({
          message: "This place is already booked for the selected dates.",
          details: {
            conflictPeriod: {
              startDate: overlappingBooking.startDate,
              endDate: overlappingBooking.endDate,
            },
          },
        });
      }
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
