import { Router } from 'express';

import { changePassword, deleteUser, sendOtp, updateUsername, userLogin, userSignup } from '../controllers/userController.js';
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post("/otp", sendOtp);
router.post("/update", requireAuth, updateUsername);
router.post("/change", requireAuth, changePassword);
router.delete("/", requireAuth, deleteUser);

export default router;