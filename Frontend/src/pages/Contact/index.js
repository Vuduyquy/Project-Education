import { Button, Card, Divider, Form, Input, notification } from "antd";
import React, { useState } from "react";
import { useCreateContact } from "../../apis/contacts.api";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [description, setDescription] = useState(null);

  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleChangeDecription = (event) => {
    setDescription(event.target.value);
  };
  const { mutate: createContact, error } = useCreateContact();

  const handleCreateContact = async () => {
    setIsLoading(true);
    const newContacts = {
      name,
      email,
      description,
    };
    console.log("Data being sent to API:", newContacts); // Kiểm tra dữ liệu trước khi gửi

    try {
      await createContact(newContacts, {
        onSuccess: (data) => {
          console.log("Response from server:", data);
          api.success({ message: "Tạo liên hệ thành công" });
          resetForm();
        },
        onError: (error) => {
          console.error("Error response from server:", error.response?.data);
          api.error({
            message: "Tạo liên hệ không thành công",
            description: error.message,
          });
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName(null);
    setEmail(null);
    setDescription(null);
  };
  return (
    <>
      <div
        style={{
          marginTop: "32px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Đóng góp ý kiến</h1>
      </div>
      <Card style={{ marginTop: "32px" }}>
        <div style={{ position: "relative" }}>
          <Divider orientation="left" style={{ margin: "0px" }}>
            Ý kiến của bạn
          </Divider>
        </div>
        <Form name="basic" layout="vertical">
          <Form.Item label="Họ và tên">
            <Input size="large" value={name} onChange={handleChangeName} />
          </Form.Item>

          <Form.Item label="Địa chỉ email">
            <Input size="large" value={email} onChange={handleChangeEmail} />
          </Form.Item>

          <Form.Item label="Ý kiến của bạn">
            <Input.TextArea
              size="large"
              value={description}
              onChange={handleChangeDecription}
            />
          </Form.Item>

          <Button type="primary" onClick={handleCreateContact}>
            Gửi ý kiến
          </Button>
        </Form>
      </Card>
    </>
  );
};
export default Contact;
