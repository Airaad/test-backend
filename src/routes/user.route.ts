import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import hostMiddleware from "../middleware/hostMiddleware";
import {
  bookListing,
  cancelBooking,
  changeRole,
  getHistory,
} from "../controllers/user.controller";

const router = Router();

//Protected Routes
router.route("/change-role").put(authMiddleware, changeRole);
router.route("/book/:id").post(authMiddleware, bookListing);
router.route("/cancel/:id").delete(authMiddleware, cancelBooking);
router.route("/get-history").get(authMiddleware, getHistory);


export default router;
