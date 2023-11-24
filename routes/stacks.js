import { Router } from "express";
import { addMovie, createStack, getStacks, getStack, deleteMovie, deleteStack, updateStack } from "../controllers/stacksController.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.post("/create", createStack);
router.post("/add", addMovie);
router.get("/", getStacks);
router.get("/:id", getStack);
router.delete("/remove", deleteMovie);
router.delete("/", deleteStack);
router.patch("/", updateStack);

export default router;