import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Kiểm tra các biến môi trường
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER hoặc EMAIL_PASS chưa được thiết lập trong file .env");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App Password)
    },
});

// Kiểm tra kết nối SMTP khi khởi tạo
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Lỗi kết nối đến Gmail SMTP:", error.message);
    } else {
        console.log("✅ Kết nối đến Gmail SMTP thành công!");
    }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Email đã gửi đến ${to}`);
    } catch (error:any) {
        console.error("❌ Lỗi khi gửi email:", error.message);
        throw new Error(`Không thể gửi email: ${error.message}`);
    }
};
