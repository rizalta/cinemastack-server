import { Router } from 'express';

import { changePassword, deleteUser, forgotPassword, sendOtp, updatePassword, updateUsername, userLogin, userSignup } from '../controllers/userController.js';
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post("/otp", sendOtp);
router.patch("/update", requireAuth, updateUsername);
router.patch("/change", requireAuth, changePassword);
router.delete("/", requireAuth, deleteUser);
router.post("/forgot", forgotPassword);
router.patch("/reset", updatePassword);

export default router;