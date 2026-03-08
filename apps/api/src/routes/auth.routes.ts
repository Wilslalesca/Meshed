import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/verify", AuthController.verify);
router.post("/resend", AuthController.resendVerification);

export default router;