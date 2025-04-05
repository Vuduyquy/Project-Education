// import { Alert, Avatar, Button, Input, List, Modal, Spin } from 'antd';
// import React from 'react';
// import { useGetContacts } from '../../../apis/contacts.api';

// const ManageFeedback = () => {
// 	const { data: contacts, isLoading, error } = useGetContacts();

// 	if (isLoading) return <Spin size="large" />;
// 	if (error) return <Alert message="Lỗi khi tải danh sách contacts!" type="error" />;

// 	return (
// 		<div>
// 			<div
// 				style={{
// 					display: 'flex',
// 					justifyContent: 'space-between',
// 					marginBottom: '12px',
// 				}}
// 			>
// 				<h1>Hòm thư góp ý </h1>
// 			</div>
// 			<Modal
// 				title='Phản hồi ý kiến'
// 				width={650}
// 				okText='Gửi'
// 				cancelText='Đóng lại'
// 			>
// 				<Input.TextArea />
// 			</Modal>
// 			<div>
// 				<List
// 					dataSource={contacts}
// 					renderItem={(item) => (
// 						<List.Item key={item._id}>
// 							<List.Item.Meta
// 								avatar={
// 									<Avatar style={{ width: '40px', height: '40px' }}>
// 										{item.name.charAt(0).toUpperCase()}
// 									</Avatar>
// 								}
// 								title={item.name}
// 								description={
// 									<div>
// 										<p><strong>Email:</strong> {item.email}</p>
// 										<p><strong>Nội dung:</strong> {item.description}</p>
// 									</div>
// 								}
// 							/>
// 							<Button type='link'>Phản hồi</Button>
// 						</List.Item>
// 					)}
// 				/>
// 			</div>
// 		</div>
// 	);
// };

// export default ManageFeedback;

import { Alert, Avatar, Button, Input, List, Modal, Spin, notification } from "antd";
import React, { useState } from "react";
import { useGetContacts } from "../../../apis/contacts.api";
import axios from "axios";

const ManageFeedback = () => {
  const { data: contacts, isLoading, error } = useGetContacts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState (null);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Hàm mở modal và gọi API để tạo nội dung phản hồi
  const handleReply = async (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
    setIsSending(true);

    try {
      const response = await axios.post("http://localhost:4000/api/v1/gemini/reply-contact", {
        email: contact.email,
        description: contact.description,
      });
      setReplyContent(response.data.replyContent);
    } catch (error) {
      api.error({
        message: "Lỗi khi tạo nội dung phản hồi",
        description: error.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
    setReplyContent("");
  };

  if (isLoading) return <Spin size="large" />;
  if (error) return <Alert message="Lỗi khi tải danh sách contacts!" type="error" />;

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
        <h1>Hòm thư góp ý</h1>
      </div>
      <Modal
        title="Phản hồi ý kiến"
        width={650}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Đóng lại
          </Button>,
        ]}
      >
        {isSending ? (
          <Spin tip="Đang tạo nội dung phản hồi..." />
        ) : (
          <Input.TextArea
            rows={6}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled
          />
        )}
      </Modal>
      <div>
        <List
          dataSource={contacts}
          renderItem={(item) => (
            <List.Item key={item._id}>
              <List.Item.Meta
                avatar={
                  <Avatar style={{ width: "40px", height: "40px" }}>
                    {item.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={item.name}
                description={
                  <div>
                    <p>
                      <strong>Email:</strong> {item.email}
                    </p>
                    <p>
                      <strong>Nội dung:</strong> {item.description}
                    </p>
                  </div>
                }
              />
              <Button type="link" onClick={() => handleReply(item)}>
                Phản hồi
              </Button>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ManageFeedback;