import React, { useContext, useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useChangePassword } from "../../apis/auth.api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";


const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const changePassword = useChangePassword();
  const {
    logout: logoutSystem,
  } = useContext(AuthContext);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
      const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
      return payload?._id || null;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  

  const handleSubmit = (values) => {
    console.log("Dữ liệu nhập vào:", values);
  
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      console.log("Lỗi: Mật khẩu xác nhận không khớp!");
      return;
    }
  
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();
  
    if (!token || !userId) {
      message.error("Bạn chưa đăng nhập!");
      return;
    }
  
    setLoading(true);
    changePassword.mutate(
      {
        userId, // Truyền userId lấy từ token
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        token, // Truyền token vào request
      },
      {
        onSuccess: () => {
          message.success("Đổi mật khẩu thành công!");
          form.resetFields();
          logoutSystem(); // Đăng xuất người dùng
          navigate("/"); // Điều hướng về trang chủ
          
        },
        onError: (error) => {
          console.error("Lỗi API:", error.response?.data);
          message.error(error.response?.data?.message || "Lỗi đổi mật khẩu!");
        },
        onSettled: () => setLoading(false),
      }
    );
  };
  

  return (
    <Card title="Đổi Mật Khẩu" style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="oldPassword"
          label="Mật khẩu cũ"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu cũ" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                console.log("Lỗi: Mật khẩu xác nhận không khớp!");
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
        </Form.Item>

        <Form.Item>
          <Button  type="primary" htmlType="submit" loading={loading} block >
            Đổi Mật Khẩu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChangePassword;
