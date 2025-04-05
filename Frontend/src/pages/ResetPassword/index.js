import { Button, Form, Input, message } from "antd";
import { useState, useEffect } from "react";
import { useResetPassword } from "../../apis/auth.api";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Lấy token từ path (/reset-password/:token)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm state cho nhập lại mật khẩu

  const { mutate: resetPassword, isLoading } = useResetPassword({
    onSuccess: (data) => {
      message.success(data.message || "Đặt lại mật khẩu thành công!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    },
    onError: (errorMessage) => {
      message.error(errorMessage || "Có lỗi xảy ra, vui lòng thử lại!");
    },
  });

  useEffect(() => {
    if (!token) {
      message.error("Token không hợp lệ hoặc đã hết hạn!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, [token]);

  const handleResetPassword = () => {
    // Kiểm tra mật khẩu mới có rỗng không
    if (!newPassword) {
      message.error("Vui lòng nhập mật khẩu mới!");
      return;
    }
    // Kiểm tra độ dài mật khẩu
    if (newPassword.length < 6) {
      message.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    // Kiểm tra mật khẩu nhập lại có rỗng không
    if (!confirmPassword) {
      message.error("Vui lòng nhập lại mật khẩu mới!");
      return;
    }
    // Kiểm tra mật khẩu nhập lại có khớp không
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu nhập lại không khớp!");
      return;
    }
    // Gửi yêu cầu đặt lại mật khẩu
    resetPassword({ newPassword, token });
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: "20px", border: "1px solid #e8e8e8", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Đặt lại mật khẩu</h2>
      <Form layout="vertical">
        <Form.Item label="Mật khẩu mới" required>
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </Form.Item>
        <Form.Item label="Nhập lại mật khẩu mới" required>
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
          />
        </Form.Item>
        <Button
          type="primary"
          onClick={handleResetPassword}
          loading={isLoading}
          disabled={isLoading}
          block
        >
          Đặt lại mật khẩu
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;