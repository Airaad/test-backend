import { Router } from "express";
import {
  addListing,
  deleteListing,
  exploreListings,
  getListingInfo,
} from "../controllers/listing.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.route("/explore").get(exploreListings);
router.route("/:id").get(getListingInfo);

//Protected Routes
router.route("/addListing").post(authMiddleware, addListing);
router.route("/remove/:id").delete(authMiddleware, deleteListing);

export default router;
