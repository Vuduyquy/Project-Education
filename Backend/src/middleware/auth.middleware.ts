import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { RequestCustom } from "../types/express.type";
import { UserPayload } from "../types/user.type";

const authMiddleware = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
): any => {
  //console.log("🔹 Middleware chạy rồi!");

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      message: "Vui lòng đăng nhập để thực hiện chức năng này",
    });
  }

  try {
    const bearerToken = token.split(" ")[1]; // Tách ra token từ 'Bearer <token>'

    const decoded = jwt.verify(bearerToken, config.JWT_SECRET) as UserPayload;
    console.log('decode', decoded)

    req.user = { _id: decoded._id, role: decoded.role };
    console.log("✅ Gán req.user thành công:", req.user);
  
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token không hợp lệ",
    });
  }
};

export default authMiddleware;
