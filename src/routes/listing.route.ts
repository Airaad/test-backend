import { Router } from "express";
import {
  addListing,
  deleteListing,
  exploreListings,
  getListingInfo,
} from "../controllers/listing.controller";
import authMiddleware from "../middleware/authMiddleware";
import hostMiddleware from "../middleware/hostMiddleware";

const router = Router();

router.route("/explore").get(exploreListings);
router.route("/:id").get(getListingInfo);

//Protected Routes
router.route("/add-listing").post(authMiddleware, hostMiddleware, addListing);
router.route("/remove/:id").delete(authMiddleware, hostMiddleware, deleteListing);

export default router;
