import { Request, Response } from "express";
import { prismaClient } from "../db/prisma";
import { listingSchema } from "../utils/zodTypes";
import z from "zod";

export const exploreListings = async (req: Request, res: Response) => {
  try {
    const places = await prismaClient.listing.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({
      places,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const getListingInfo = async (req: Request, res: Response) => {
  const placeId = req.params.id;
  try {
    const place = await prismaClient.listing.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return res.status(404).json({
        message: "Place not found",
      });
    }

    res.status(200).json({
      place,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const addListing = async (req: Request, res: Response) => {
  const hostId = req.userId;
  if (!hostId) {
    return res.status(409).json({
      message: "Unauthorized!",
    });
  }

  const validatedData = listingSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res.status(403).json({
      message: z.prettifyError(validatedData.error),
    });
  }
  const { title, price, priceTag, address, description } = validatedData.data;
  try {
    const isValidUser = await prismaClient.user.findUnique({
      where: { id: hostId },
    });
    if (!isValidUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const createdPlace = await prismaClient.listing.create({
      data: {
        title,
        thumbnail:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D",
        address,
        description,
        price,
        priceTag,
        hostId,
        averageRating: 0,
      },
    });
    res.status(201).json({
      message: "Place added successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  const hostId = req.userId;
  const placeId = req.params.id;
  if (!hostId) {
    return res.status(409).json({
      message: "Unauthorized!",
    });
  }
  try {
    const isValidUser = await prismaClient.user.findUnique({
      where: { id: hostId },
    });
    if (!isValidUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    await prismaClient.listing.delete({
      where: { id: placeId, hostId },
    });

    res.status(201).json({
      message: "Place removed successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
