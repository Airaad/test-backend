import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import hostMiddleware from "../middleware/hostMiddleware";
import { bookListing, changeRole } from "../controllers/user.controller";

const router = Router();

//Protected Routes
router.route("/change-role").put(authMiddleware, changeRole);
router.route("/book/:id").post(authMiddleware, bookListing);

export default router;
