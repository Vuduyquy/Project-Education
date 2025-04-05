import express, { Request, Response } from "express";
import config from "./config/config";
import connectDB from "./config/db";
import authRoutes from "./modules/user/routes/auth.route";
import cors from "cors";
import categoryRoutes from "./modules/category/routes/category.route";
import contactRoutes from "./modules/contact/routers/contact.routers"
import quizzRoutes from "./modules/quizz/routes/quizz.route";
import courseRoutes from "./modules/course/routes/course.route";
import lessonRoutes from "./modules/lesson/routes/lesson.route";
import reviewRoutes from "./modules/review/routes/review.route";
import scheduleRoutes from "./modules/schedule/routes/schedule.route";
import discussionRoutes from "./modules/discussion/routes/discussion.route";
import usersQuizzesRoutes from "./modules/users_quizzes/routes/users_quizzes.route";
import questionRoutes from "./modules/question/routes/question.route";
import uploadRouter from "./utils/upload";
import geminiRouter from "./utils/gemini";
import notificationRoutes from "./modules/notification/routes/notification.route"
import multer from "multer";
import path from "path";
import fs from "fs";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();


const app = express();
const apiRouter = express.Router();

connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
  origin: "http://localhost:3000", // Hoặc dùng '*' để cho phép tất cả
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  
}));
app.use(passport.initialize());


// Cho phép truy cập video từ thư mục "uploads"
app.use("/uploads", express.static("uploads"));

// Đăng ký các routes với apiRouter
apiRouter.use("/auth", authRoutes);
apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/quizzes", quizzRoutes);
apiRouter.use("/courses", courseRoutes);
apiRouter.use("/lessons", lessonRoutes);
apiRouter.use("/reviews", reviewRoutes);
apiRouter.use("/schedules", scheduleRoutes);
apiRouter.use("/discussions", discussionRoutes);
apiRouter.use("/users-quizzes", usersQuizzesRoutes);
apiRouter.use("/questions", questionRoutes);
apiRouter.use("/contacts", contactRoutes);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/gemini", geminiRouter);
apiRouter.use("/notifications", notificationRoutes);

// Áp dụng prefix global
app.use("/api/v1", apiRouter);

const PORT = config.PORT||4000;

app.listen(PORT, () => {
  console.log(`Server đang chạy trên: ${PORT}`);
});
