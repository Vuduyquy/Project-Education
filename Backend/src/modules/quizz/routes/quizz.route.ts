import express from "express";
import authMiddleware from "../../../middleware/auth.middleware";
import roleMiddleware from "../../../middleware/role.middleware";
import {
  createQuizz,
  getQuizz,
  updateQuizz,
  deleteQuizz,
  getAllQuizz,
} from "../controllers/quizz.controller";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["teacher", "admin"]),
  createQuizz
);
router.get("/", getAllQuizz);
router.get("/:id", authMiddleware, getQuizz);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["teacher", "admin"]),
  updateQuizz
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["teacher", "admin"]),
  deleteQuizz
);

export default router;
