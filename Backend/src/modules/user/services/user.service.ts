import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model";
import { sendEmail } from "../../../utils/emailServic";
import {
  generateRefreshToken,
  generateToken,
} from "../../../utils/generateToken";
import mongoose from "mongoose";
import { hashPassword } from "../../../utils/hashPassword";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../../../config/config";

export const registerUser = async (
  email: string,
  password: string,
  fullName: string
) => {
  let user = await User.findOne({ email });
  if (user) throw { statusCode: 400, message: "Người dùng đã tồn tại" };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({ email, password: hashedPassword, fullName });
  await user.save();

  const token = generateToken(user);
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw { statusCode: 400, message: "Email chưa tồn tại" };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { statusCode: 400, message: "Mật khẩu không trùng khớp" };

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  return { user, token, refreshToken };
};

export const getUserById = async (userId: mongoose.Types.ObjectId | string) => {
  //console.log("Received userId:", userId);

  // Chuyển ObjectId thành string nếu cần
  const userIdString =
    userId instanceof mongoose.Types.ObjectId ? userId.toString() : userId;

  // Kiểm tra ID có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(userIdString)) {
    //console.error("Invalid User ID");
    throw { statusCode: 400, message: "ID người dùng không hợp lệ" };
  }

  const user = await User.findById(userIdString)
    .select("-password")
    .select("courses")
    .populate({
        path: "courses",
        populate: { path: "instructorId", select: "fullName" }, // Lấy tên người dùng từ userId
      })
    .populate("quiz", "title");

  if (!user) {
    //console.error("User not found for ID:", userIdString);
    throw { statusCode: 404, message: "Không tìm thấy người dùng" };
  }

  //console.log("User found:", user);
  return user;
};

// export const getAllUsers = async () => {
//     try {
//         const users = await User.find().populate('courses','title').populate('quiz', 'title').select("-password"); // Lấy toàn bộ user nhưng không trả về password
//         return users;
//     } catch (error) {
//         throw { statusCode: 500, message: "Lỗi khi lấy danh sách người dùng" };
//     }
// };

export const getAllUsers = async (
  page: number = 1,
  limit: number = 5
): Promise<{
  data: any[]; // Thay any bằng interface của User nếu có
  total: number;
  page: number;
  limit: number;
}> => {
  const pageNumber = Math.max(1, parseInt(String(page), 10));
  const pageSize = Math.max(1, parseInt(String(limit), 10));
  const skip = (pageNumber - 1) * pageSize;

  try {
    const users = await User.find()
      .populate("courses", "title")
      .populate("quiz", "title")
      .select("-password") // Không trả về password
      .skip(skip)
      .limit(pageSize);

    const total = await User.countDocuments();

    return {
      data: users,
      total,
      page: pageNumber,
      limit: pageSize,
    };
  } catch (error) {
    throw { statusCode: 500, message: "Lỗi khi lấy danh sách người dùng" };
  }
};

export const updateUserService = async (
  userId: mongoose.Types.ObjectId,
  updatedData: any
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw { statusCode: 400, message: "ID người dùng không hợp lệ" };
  }

  if (updatedData.password) {
    throw {
      statusCode: 400,
      message: "Không thể cập nhật mật khẩu từ API này",
    };
  }

  const user = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw { statusCode: 404, message: "Không tìm thấy người dùng" };
  }

  return user;
};


export const changeUserPassword = async (
  userId: mongoose.Types.ObjectId,
  oldPassword: string,
  newPassword: string
) => {
  try {
    console.log("🔍 Đang đổi mật khẩu cho:", userId);

    const user = await User.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: "Người dùng không tồn tại" };
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw { statusCode: 400, message: "Mật khẩu cũ không đúng" };
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { status: 200, message: "Đổi mật khẩu thành công" };
  } catch (error: any) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Lỗi server",
    };
  }
};

export const requestPasswordReset = async (email: string) => {
  // Kiểm tra email trống hoặc không hợp lệ
  if (!email) {
    throw { statusCode: 400, message: "Email là bắt buộc" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw { statusCode: 400, message: "Email không đúng định dạng" };
  }

  // Tìm user trong database
  const user = await User.findOne({ email });
  if (!user) {
    throw { statusCode: 404, message: "Email không tồn tại" };
  }

  // Tạo token đặt lại mật khẩu
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Hết hạn trong 15 phút

  // Lưu token vào database
  await user.save();

  // Tạo URL đặt lại mật khẩu
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  const message = `Nhấp vào liên kết sau để đặt lại mật khẩu: \n\n ${resetUrl}`;

  // Gửi email
  try {
    await sendEmail(user.email, "Đặt lại mật khẩu", message);
  } catch (error: any) {
    // Nếu gửi email thất bại, xóa token để tránh lưu token không sử dụng được
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    throw {
      statusCode: 500,
      message: "Không thể gửi email đặt lại mật khẩu: " + error.message,
    };
  }

  return { message: "Email đặt lại mật khẩu đã được gửi" };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    throw { statusCode: 400, message: "Token không hợp lệ hoặc đã hết hạn" };

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return { message: "Đặt lại mật khẩu thành công" };
};


export const configureGoogleStrategy = () => {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function
      ) => {
        try {
          //console.log("Google profile:", profile);
          const { id, emails, name, photos } = profile;
          
          // Kiểm tra xem người dùng đã tồn tại chưa
          let existingUser = await User.findOne({ googleId: id });
          
          // Nếu không tìm thấy bằng googleId, thử tìm bằng email
          if (!existingUser && emails && emails.length > 0) {
            existingUser = await User.findOne({ email: emails[0].value });
          }

          if (existingUser) {
            // Nếu tìm thấy user bằng email nhưng chưa có googleId, cập nhật googleId
            if (!existingUser.googleId) {
              existingUser.googleId = id;
              await existingUser.save();
            }
            return done(null, existingUser);
          }

          // Tạo mật khẩu ngẫu nhiên
          const randomPassword = crypto.randomBytes(6).toString('hex');
          const hashedPassword = await hashPassword(randomPassword);

          // Tạo user mới
          const newUser = new User({
            googleId: id,
            email: emails && emails.length > 0 ? emails[0].value : `${id}@google.com`,
            fullName: name ? `${name.givenName || ''} ${name.familyName || ''}`.trim() : 'Google User',
            password: hashedPassword,
            avatar: photos && photos.length > 0 ? photos[0].value : undefined,
          });

          await newUser.save();
          console.log("Đã tạo user mới từ Google:", newUser);
          return done(null, newUser);
        } catch (error) {
          console.error("Lỗi xác thực Google:", error);
          return done(error, null);
        }
      }
    )
  );
};