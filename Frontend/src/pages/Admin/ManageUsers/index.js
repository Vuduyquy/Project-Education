import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Select, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useGetAllUsers, useUpdateUser } from "../../../apis/auth.api";

const ManageUsers = () => {
  const [listUsers, setListUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Lưu user được chọn
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái mở modal
  const [api, contextHolder] = notification.useNotification();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const { data: userData, isLoading: isLoadingCategory } = useGetAllUsers(
    (data) => {
      setListUsers(data);
    },
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (userData) {
      setListUsers(userData?.data);
    }
  }, [userData]);

  const { mutate: updateUser } = useUpdateUser({
    onSuccess: () => {
      api.success({ message: "Cập nhật người dùng thành công!" });
      setIsEditModalVisible(false);
    },
    onError: (error) => {
      api.error({ message: "Lỗi cập nhật người dùng", description: error.message });
    },
  });
  
  const handleUpdateUser = () => {
    editForm.validateFields().then((values) => {
      updateUser({ user: selectedUser.key, payload: values });
    });
  };
  

  // Hàm mở modal và set user đang chọn
  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const showEditUserModal = (user) => {
    console.log('user', user);
    setSelectedUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditModalVisible(true);
  };
  

  const columns = [
    {
      title: "Tên user",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Vai trò",
      key: "role",
      dataIndex: "role",
    },
    {
      title: "Môn thi",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Khoá học",
      key: "course",
      dataIndex: "course",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Button shape="circle" icon={<EyeOutlined />} onClick={() => showUserDetails(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => showEditUserModal(record)}
              style={{ marginLeft: 8 }}
            />
          </Tooltip>
        </>
      ),
    }
    
  ];

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h1>Danh sách người dùng </h1>
      </div>

      <Table
        columns={columns}
        dataSource={
          listUsers.map((user) => ({
            key: user._id, 
            name: user.fullName,
            email: user.email,
            role: user.role,
            category: user.quiz.length > 0 
              ? user.quiz.map((exam) => (
                  <Tag color="blue" key={exam._id}>
                    {exam.title}
                  </Tag>
                ))
              : "Chưa có môn thi",
            course:
              user.courses.length > 0
                ? user.courses.map((course) => (
                    <Tag color="blue" key={course._id}>
                      {course.title}
                    </Tag>
                  ))
                : "Chưa đăng ký",
          })) || []
        }
        loading={isLoadingCategory}
      />

      {/* Modal hiển thị chi tiết user */}
      <Modal
        title="Thông tin chi tiết người dùng"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p><strong>Tên:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Vai trò:</strong> {selectedUser.role}</p>
            <p><strong>Môn thi:</strong> {selectedUser.category}</p>
            <p><strong>Khoá học:</strong> {selectedUser.course}</p>
          </div>
        )}
      </Modal>

      <Modal
  title="Chỉnh sửa người dùng"
  open={isEditModalVisible}
  onCancel={() => setIsEditModalVisible(false)}
  onOk={handleUpdateUser}
  okText="Lưu"
  cancelText="Hủy"
>
  <Form form={editForm} layout="vertical">
    <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Nhập tên" }]}>
      <Input />
    </Form.Item>
    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Nhập email hợp lệ" }]}>
      <Input />
    </Form.Item>
    <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Chọn vai trò" }]}>
      <Select>
        <Select.Option value="student">Student</Select.Option>
        <Select.Option value="teacher">Teacher</Select.Option>
        <Select.Option value="admin">Admin</Select.Option>
      </Select>
    </Form.Item>
  </Form>
</Modal>

    </div>
  );
};

export default ManageUsers;
