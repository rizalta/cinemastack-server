import { Router } from 'express';

import { sendOtp, updateUsername, userLogin, userSignup } from '../controllers/userController.js';
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post("/otp", sendOtp);
router.post("/update", requireAuth, updateUsername);

export default router;