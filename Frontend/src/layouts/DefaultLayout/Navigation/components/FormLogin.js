import { Button, Checkbox, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import { useGoogleLogin, useRequestPasswordReset } from "../../../../apis/auth.api";

const FormLogin = ({ onRegister, formLogin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { mutate: requestPasswordReset, isLoading } = useRequestPasswordReset({
    onSuccess: (data) => {
      message.success(data.message || "Vui lòng kiểm tra email để đặt lại mật khẩu!");
      handleCancel();
    },
    onError: (errorMessage) => {
      message.error(errorMessage || "Có lỗi xảy ra, vui lòng thử lại!");
    },
  });

  // Hook để đăng nhập Google
  const { mutate: googleLogin, isLoading: googleLoading } = useGoogleLogin({
    onSuccess: () => {
      console.log("Đang chuyển hướng đến Google...");
    },
    onError: (error) => {
      message.error("Đăng nhập Google thất bại!");
      console.error("Lỗi đăng nhập Google:", error);
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEmail("");
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = () => {
    if (!email) {
      message.error("Vui lòng nhập email!");
      return;
    }
    if (!isValidEmail(email)) {
      message.error("Email không đúng định dạng!");
      return;
    }
    // Gửi yêu cầu đặt lại mật khẩu
    requestPasswordReset({ email });
  };

  // Xử lý đăng nhập Google
  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <>
      <Form name="basic" layout="vertical">
        <Form.Item
          label="Email"
          rules={[{ required: true }]}
          validateStatus={formLogin.errors.email && "error"}
          help={formLogin.errors.email && formLogin.errors.email}
        >
          <Input
            size="large"
            name="email"
            onChange={formLogin.handleChange}
            onBlur={formLogin.handleBlur}
            value={formLogin.values.email}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          rules={[{ required: true }]}
          validateStatus={formLogin.errors.password && "error"}
          help={formLogin.errors.password && formLogin.errors.password}
        >
          <Input.Password
            size="large"
            name="password"
            onChange={formLogin.handleChange}
            onBlur={formLogin.handleBlur}
            value={formLogin.values.password} // Sửa lỗi: từ values.email thành values.password
          />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ mật khẩu</Checkbox>
          </Form.Item>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Button type="link" onClick={onRegister}>
              Đăng ký
            </Button>
            <Button type="link" onClick={showModal}>
              Quên mật khẩu
            </Button>
          </div>
        </div>
      </Form>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "30px",
        }}
      >
        <Button onClick={handleGoogleLogin} type="primary" loading={googleLoading}>
          Đăng nhập với Google
        </Button>
      </div>

      <Modal
        title="Quên mật khẩu"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handleForgotPassword}
          >
            Gửi yêu cầu
          </Button>,
        ]}
      >
        <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu:</p>
        <Input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default FormLogin;