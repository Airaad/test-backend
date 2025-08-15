import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import hostMiddleware from "../middleware/hostMiddleware";
import { changeRole } from "../controllers/user.controller";

const router = Router();

//Protected Routes
router.route("/change-role").put(authMiddleware , changeRole);

export default router;

