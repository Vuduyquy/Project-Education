

import React, { useState, useMemo } from "react";
import { Tabs, List, Avatar, Badge, Typography, Card } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useGetNotifications, useMarkNotificationAsRead } from "../../apis/notification.api";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";

const { TabPane } = Tabs;
const { Text } = Typography;

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();

  // Lấy danh sách thông báo từ API
  const { data, isLoading, error } = useGetNotifications();
  console.log("Raw Notifications Data:", data);

  // Lấy danh sách thông báo từ dữ liệu API
  const notificationsData = data|| []; // Đảm bảo dữ liệu là mảng
  console.log("Parsed Notifications Data:", notificationsData);

  // Lấy userId từ token
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      userId = payload._id;
      console.log("UserId from token:", userId);
    } catch (e) {
      console.error("Error parsing token:", e);
    }
  }

  // Hook để đánh dấu thông báo là đã đọc
  const { mutate: markAsRead } = useMarkNotificationAsRead({
    onSuccess: () => {
      console.log("Đánh dấu thông báo đã đọc thành công");
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (error) => {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
    },
  });

  // Xử lý khi người dùng click vào thông báo
  const handleNotificationClick = (notification) => {
    if (!notification.seen) {
      markAsRead(notification._id);
    }
  };

  // Lọc dữ liệu theo tab với useMemo
  const filteredNotifications = useMemo(() => {
    if (!Array.isArray(notificationsData) || notificationsData.length === 0) {
      console.log("No notifications data available");
      return [];
    }

    console.log("Filtered notifications:", notificationsData);
    if (activeTab === "all") {
      return notificationsData;
    } else if (activeTab === "read") {
      return notificationsData.filter((notification) => notification.seen);
    } else {
      return notificationsData.filter((notification) => !notification.seen);
    }
  }, [notificationsData, activeTab]);

  // Log trước khi render
  console.log("Filtered notifications before render:", filteredNotifications);

  // Định dạng ngày tháng từ createdAt với moment
  const formatDate = (date) => moment(date).format("MMM D, YYYY");

  return (
    
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
        <Card>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Thông báo</h1>

      {isLoading && <p>Đang tải thông báo...</p>}
      {error && <p style={{ color: "red" }}>Lỗi khi tải thông báo: {error.message}</p>}

      {!isLoading && !error && filteredNotifications.length === 0 && (
        <p>Không có thông báo nào.</p>
      )}

      <Tabs defaultActiveKey="all" onChange={(key) => setActiveTab(key)} style={{ marginBottom: "20px" }}>
        <TabPane tab="Tất cả" key="all" />
        <TabPane tab="Đã đọc" key="read" />
        <TabPane tab="Chưa đọc" key="unread" />
      </Tabs>

      {!isLoading && !error && filteredNotifications.length > 0 && (
        <List
          itemLayout="horizontal"
          dataSource={filteredNotifications}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleNotificationClick(item)}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #f0f0f0",
                backgroundColor: item.seen ? "#fff" : "#f5f5f5",
                cursor: "pointer",
              }}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!item.seen}>
                    <Avatar
                      icon={<BellOutlined />}
                      style={{
                        backgroundColor: item.seen ? "#ff6b1c" : "#1890ff",
                        color: "#fff",
                      }}
                    />
                  </Badge>
                }
                title={<Text strong={!item.seen}>{item.message}</Text>}
                description={<Text type="secondary">{formatDate(item.createdAt)}</Text>}
              />
            </List.Item>
          )}
        />
      )}
      </Card>
    </div>
    
  );
};

export default NotificationPage;