import { Router } from "express";
import { userLogin, userRegister } from "../controllers/auth.controller";

const router = Router();

router.route("/signup").post(userRegister);
router.route("/signin").post(userLogin);

export default router;
