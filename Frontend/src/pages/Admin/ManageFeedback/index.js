// import { Alert, Avatar, Button, Input, List, Modal, Spin, notification } from "antd";
// import React, { useState } from "react";
// import { useGetContacts } from "../../../apis/contacts.api";
// import axios from "axios";

// const ManageFeedback = () => {
//   const { data: contacts, isLoading, error } = useGetContacts();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedContact, setSelectedContact] = useState (null);
//   const [replyContent, setReplyContent] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const [api, contextHolder] = notification.useNotification();

//   // Hàm mở modal và gọi API để tạo nội dung phản hồi
//   const handleReply = async (contact) => {
//     setSelectedContact(contact);
//     setIsModalOpen(true);
//     setIsSending(true);

//     try {
//       const response = await axios.post("http://localhost:4000/api/v1/gemini/reply-contact", {
//         email: contact.email,
//         description: contact.description,
//       });
//       setReplyContent(response.data.replyContent);
//     } catch (error) {
//       api.error({
//         message: "Lỗi khi tạo nội dung phản hồi",
//         description: error.message,
//       });
//     } finally {
//       setIsSending(false);
//     }
//   };

//   // Hàm đóng modal
//   const handleCancel = () => {
//     setIsModalOpen(false);
//     setSelectedContact(null);
//     setReplyContent("");
//   };

//   if (isLoading) return <Spin size="large" />;
//   if (error) return <Alert message="Lỗi khi tải danh sách contacts!" type="error" />;

//   return (
//     <div>
//       {contextHolder}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: "12px",
//         }}
//       >
//         <h1>Hòm thư góp ý</h1>
//       </div>
//       <Modal
//         title="Phản hồi ý kiến"
//         width={650}
//         open={isModalOpen}
//         onCancel={handleCancel}
//         footer={[
//           <Button key="cancel" onClick={handleCancel}>
//             Đóng lại
//           </Button>,
//         ]}
//       >
//         {isSending ? (
//           <Spin tip="Đang tạo nội dung phản hồi..." />
//         ) : (
//           <Input.TextArea
//             rows={6}
//             value={replyContent}
//             onChange={(e) => setReplyContent(e.target.value)}
//             disabled
//           />
//         )}
//       </Modal>
//       <div>
//         <List
//           dataSource={contacts}
//           renderItem={(item) => (
//             <List.Item key={item._id}>
//               <List.Item.Meta
//                 avatar={
//                   <Avatar style={{ width: "40px", height: "40px" }}>
//                     {item.name.charAt(0).toUpperCase()}
//                   </Avatar>
//                 }
//                 title={item.name}
//                 description={
//                   <div>
//                     <p>
//                       <strong>Email:</strong> {item.email}
//                     </p>
//                     <p>
//                       <strong>Nội dung:</strong> {item.description}
//                     </p>
//                   </div>
//                 }
//               />
//               <Button type="link" onClick={() => handleReply(item)}>
//                 Phản hồi
//               </Button>
//             </List.Item>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

// export default ManageFeedback;

import { Alert, Avatar, Button, Input, List, Modal, Spin, Typography,Badge,Divider, notification } from "antd";
import React, { useState } from "react";
import { useGetContacts } from "../../../apis/contacts.api";
import axios from "axios";
import { MailOutlined, SendOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Style cho container chính
const containerStyle = {
  padding: "24px",
  backgroundColor: "#f5f7fa",
  borderRadius: "8px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  maxWidth: "1200px",
  margin: "0 auto",
};

// Style cho header
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  padding: "0 0 16px 0",
  borderBottom: "1px solid #e8e8e8",
};

// Style cho list container
const listContainerStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

// Style cho list item
const listItemStyle = {
  transition: "all 0.3s ease",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "8px",
  border: "1px solid #f0f0f0",
};

// Style cho avatar
const avatarStyle = {
  backgroundColor: "#1890ff",
  color: "#fff",
  fontWeight: "bold",
  boxShadow: "0 2px 5px rgba(24, 144, 255, 0.3)",
};

// Style cho button
const replyButtonStyle = {
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "all 0.3s",
};

const ManageFeedback = () => {
  const { data: contacts, isLoading, error } = useGetContacts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Hàm mở modal để phản hồi thủ công
  const handleReply = (contact) => {
    setSelectedContact(contact);
    setReplyContent(""); // Đặt lại nội dung phản hồi
    setIsModalOpen(true);
  };

  // Hàm gửi email phản hồi
  const handleSendReply = async () => {
    if (!replyContent.trim()) {
      api.warning({
        message: "Nội dung trống",
        description: "Vui lòng nhập nội dung phản hồi trước khi gửi!",
        placement: "topRight",
      });
      return;
    }

    setIsSending(true);
    try {
      await axios.post("http://localhost:4000/api/v1/send-email", {
        to: selectedContact.email,
        subject: `Phản hồi ý kiến đến ${selectedContact.name}`,
        content: replyContent,
      });
      api.success({
        message: "Gửi phản hồi thành công",
        description: `Phản hồi đã được gửi đến ${selectedContact.email}`,
        placement: "topRight",
      });
      setIsModalOpen(false);
      setSelectedContact(null);
      setReplyContent("");
    } catch (error) {
      api.error({
        message: "Lỗi khi gửi phản hồi",
        description: error.message || "Không thể gửi email. Vui lòng thử lại!",
        placement: "topRight",
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

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Spin size="large" tip="Đang tải dữ liệu..." />
    </div>
  );
  
  if (error) return (
    <Alert 
      message="Lỗi khi tải danh sách góp ý" 
      description={error.message}
      type="error" 
      showIcon 
      style={{ maxWidth: '800px', margin: '20px auto' }}
    />
  );

  return (
    <div style={containerStyle}>
      {contextHolder}
      <div style={headerStyle}>
        <Title level={2} style={{ margin: 0 }}>
          <MailOutlined style={{ marginRight: 12, color: '#1890ff' }} /> Hòm thư góp ý
        </Title>
        <Badge count={contacts?.length || 0} overflowCount={99}>
          <Text type="secondary">Tổng số góp ý</Text>
        </Badge>
      </div>

      <div style={listContainerStyle}>
        {contacts?.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={contacts}
            renderItem={(item) => (
              <List.Item 
                key={item._id}
                style={listItemStyle}
                actions={[
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />} 
                    onClick={() => handleReply(item)}
                    style={replyButtonStyle}
                  >
                    Phản hồi
                  </Button>
                ]}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.09)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      size={48} 
                      style={avatarStyle}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Text strong style={{ fontSize: '16px' }}>{item.name}</Text>
                      <Divider type="vertical" />
                      <Text type="secondary" style={{ fontSize: '14px' }}>{item.email}</Text>
                    </div>
                  }
                  description={
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '12px', 
                      backgroundColor: '#f5f7fa', 
                      borderRadius: '6px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <Text>{item.description}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <MailOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <p style={{ marginTop: '16px', color: '#999' }}>Chưa có góp ý nào</p>
          </div>
        )}
      </div>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SendOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            <span>Phản hồi ý kiến đến {selectedContact?.name}</span>
          </div>
        }
        width={700}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button 
            key="cancel" 
            onClick={handleCancel}
            icon={<CloseCircleOutlined />}
            style={{ borderRadius: '6px' }}
          >
            Đóng lại
          </Button>,
          <Button
            key="send"
            type="primary"
            onClick={handleSendReply}
            loading={isSending}
            icon={<SendOutlined />}
            style={{ borderRadius: '6px' }}
          >
            Gửi phản hồi
          </Button>,
        ]}
        bodyStyle={{ padding: '24px' }}
        style={{ top: 20 }}
      >
        {selectedContact && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f5f7fa', 
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #e8e8e8'
            }}>
              <Text strong>Nội dung góp ý:</Text>
              <div style={{ marginTop: '8px' }}>
                {selectedContact.description}
              </div>
            </div>
            
            <Text strong>Nội dung phản hồi:</Text>
            <Input.TextArea
              rows={8}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Nhập nội dung phản hồi của bạn..."
              style={{ 
                marginTop: '8px', 
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px'
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageFeedback;
