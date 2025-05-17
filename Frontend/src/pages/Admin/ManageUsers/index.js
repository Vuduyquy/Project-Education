import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Select, Table, Tag, Tooltip, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useGetAllUsers, useUpdateofUser, useUpdateUser } from "../../../apis/auth.api";
const ManageUsers = () => {
  const [listUsers, setListUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Lưu user được chọn
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái mở modal
  const [api, contextHolder] = notification.useNotification();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1); // Thêm trạng thái cho phân trang
  const [pageSize] = useState(5); // Số bản ghi mỗi trang, tương tự ManageLesson

  const { data: userData, isLoading: isLoadingCategory, refetch } = useGetAllUsers(
    currentPage, // Truyền page
    pageSize, // Truyền limit
    (data) => {
      setListUsers(data);
    },
    (error) => {
      api.error({
        message: "Không thể tải danh sách người dùng",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (userData) {
      setListUsers(userData?.data || []);
    }
  }, [userData]);

  const { mutate: updateUser, isLoading: isUpdating } = useUpdateUser({
    onSuccess: () => {
      api.success({ message: "Cập nhật người dùng thành công!" });
      setIsEditModalVisible(false);
      refetch(); // Làm mới danh sách sau khi cập nhật
    },
    onError: (error) => {
      console.log("Update error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      api.error({ message: "Lỗi cập nhật người dùng", description: error.message });
    },
  });

  const handleUpdateUser = () => {
    editForm.validateFields().then((values) => {
      const payload = {
        role: values.role.toLowerCase(), // Chỉ gửi role và đảm bảo chữ thường
      };
      console.log("User ID:", selectedUser.key);
      console.log("Payload:", payload);
      updateUser({ userIds: selectedUser.key, payload });
    }).catch((error) => {
      console.log("Form validation failed:", error);
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
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              style={{ backgroundColor: "#52c41a", color: "white", border: "none", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#73d13d"; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#52c41a"; e.currentTarget.style.transform = "scale(1)"; }}
              onClick={() => showUserDetails(record)}
            />
          </Tooltip>
          {/* <Tooltip title="Chỉnh sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => showEditUserModal(record)}
              style={{ backgroundColor: "#1890ff", color: "white", border: "none", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#40a9ff"; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1890ff"; e.currentTarget.style.transform = "scale(1)"; }}
            />
          </Tooltip> */}
        </Space>
      ),
    },
  ];

  const tableStyle = {
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "white", minHeight: "100px" }}>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <h1 style={{ color: "black", fontSize: "20px" }}>Danh sách người dùng</h1>
      </div>

      <div style={{ maxHeight: "500px", overflow: "auto" }}>
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
              course: user.courses.length > 0
                ? user.courses.map((course) => (
                    <Tag color="blue" key={course._id}>
                      {course.title}
                    </Tag>
                  ))
                : "Chưa đăng ký",
            })) || []
          }
          loading={isLoadingCategory}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: userData?.pagination?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} người dùng`,
            itemRender: (current, type, originalElement) => {
              if (type === "prev") return <a style={{ color: "#1890ff", fontWeight: "bold", padding: "5px 10px" }}>Trước</a>;
              if (type === "next") return <a style={{ color: "#1890ff", fontWeight: "bold", padding: "5px 10px" }}>Sau</a>;
              return originalElement;
            },
          }}
          style={tableStyle}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{ backgroundColor: "#1890ff", color: "white", fontSize: "13px", padding: "12px", textAlign: "center" }}
                />
              ),
            },
          }}
          rowClassName={() => "custom-row"}
          onRow={() => ({
            onMouseEnter: (event) => { event.currentTarget.style.backgroundColor = "#f0f0f0"; event.currentTarget.style.transition = "all 0.3s"; },
            onMouseLeave: (event) => { event.currentTarget.style.backgroundColor = "white"; },
          })}
        />
      </div>

      {/* Modal hiển thị chi tiết user */}
      <Modal
        title="Thông tin chi tiết người dùng"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        style={{ top: "20px" }}
        styles={{ body: { padding: "20px", backgroundColor: "#fff", borderRadius: "8px" } }} // Thay bodyStyle bằng styles
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

      {/* Modal chỉnh sửa người dùng */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdateUser}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isUpdating}
        width={800}
        style={{ top: "20px" }}
        styles={{ body: { padding: "20px", backgroundColor: "#fff", borderRadius: "8px" } }} // Thay bodyStyle bằng styles
        okButtonProps={{ style: { backgroundColor: "#1890ff", borderColor: "#1890ff", borderRadius: "4px", padding: "5px 15px" } }}
        cancelButtonProps={{ style: { borderRadius: "4px", padding: "5px 15px" } }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Nhập tên" }]}>
            <Input
              style={{ borderRadius: "4px", padding: "8px", borderColor: "#d9d9d9" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1890ff"; e.currentTarget.style.boxShadow = "0 0 5px #1890ff"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Nhập email hợp lệ" }]}>
            <Input
              style={{ borderRadius: "4px", padding: "8px", borderColor: "#d9d9d9" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1890ff"; e.currentTarget.style.boxShadow = "0 0 5px #1890ff"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Chọn vai trò" }]}>
            <Select
              size="large"
              placeholder="Chọn vai trò"
              style={{ width: "100%", borderRadius: "4px" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1890ff"; e.currentTarget.style.boxShadow = "0 0 5px #1890ff"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <Select.Option value="student">student</Select.Option>
              <Select.Option value="teacher">teacher</Select.Option>
              <Select.Option value="admin">admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;


