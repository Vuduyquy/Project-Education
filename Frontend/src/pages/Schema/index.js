import React, { useEffect, useState } from "react";
import { Table, Card, Button, message, notification } from "antd";
import { useGetAllSchedules, useJoinSchedule } from "../../apis/schedule.api";


//const userId = "6782631c93ea1d36c5048cf1"; // Giả định userId từ session hoặc context

const Schema = () => {
  const [api, contextHolder] = notification.useNotification();
  const [listSchedules, setListSchedules] = useState([]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
      console.log("payloadBase64", payloadBase64);
      const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
      console.log("payload", payload?._id);
      return payload?._id || null;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  // Fetch danh sách lịch
  const { data: scheduleData, isLoading: isLoadingCategory } = useGetAllSchedules(
    (data) => setListSchedules(data.data),
    (error) => api.error({ message: "Không thể tải danh mục", description: error.message })
  );

  useEffect(() => {
    if (scheduleData) setListSchedules(scheduleData?.data);
  }, [scheduleData]);

  // Hook tham gia lịch
  const { mutate: joinSchedule, isLoading: isJoining } = useJoinSchedule(
    (data) => {
      message.success("Tham gia thành công!");
      setListSchedules((prevSchedules) =>
        prevSchedules.map((schedule) =>
          schedule._id === data.data._id ? data.data : schedule
        )
      );
    },
    (error) => message.error("Lỗi khi tham gia: " + error.message)
  );

  // Xử lý tham gia
  const handleJoinSchedule = (scheduleId) => {
    const schedule = listSchedules.find((s) => s._id === scheduleId);
    if (schedule.usersJoin.some((user) => user.userId && user.userId._id === userId)) {
      message.warning("Bạn đã tham gia lịch này rồi!");
      return;
    }
  
    joinSchedule(
      { id: scheduleId, payload: { userId, status: "accepted" } },
      {
        onSuccess: (data) => {
          message.success("Tham gia thành công!");
  
          // Cập nhật lại danh sách lịch học ngay lập tức
          setListSchedules((prevSchedules) =>
            prevSchedules.map((schedule) =>
              schedule._id === scheduleId
                ? { 
                    ...schedule, 
                    usersJoin: [
                      ...schedule.usersJoin, 
                      { userId: { _id: userId, fullName: "Bạn" }, status: "accepted" }
                    ] 
                  }
                : schedule
            )
          );
        },
        onError: (error) => {
          message.error("Lỗi khi tham gia: " + error.message);
        },
      }
    );
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(dateString));
  };
  

  const columns = [
    { title: "Người tạo", dataIndex: "userCreated", key: "userCreated" },
    { title: "Loại", dataIndex: "type", key: "type" },
    { title: "Khoá học", dataIndex: "course", key: "course" },
    { title: "Bắt đầu", dataIndex: "timeStart", key: "timeStart" },
    { title: "Kết thúc", dataIndex: "timeEnd", key: "timeEnd" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        record.usersJoin.some((user) => user.userId && user.userId._id === userId) ? (
          <span>✅ Đã tham gia</span>
        ) : (
          <Button type="primary" onClick={() => handleJoinSchedule(record._id)} loading={isJoining}>
            Tham gia
          </Button>
        ),
    },
  ];

  return (
    <Card style={{ maxWidth: "90%", margin: "auto", padding: 20, maxHeight: "80vh", overflowY: "auto" }}>
      {contextHolder}
      <h2 style={{ textAlign: "center", fontWeight: "bold", paddingBottom: "20px", fontSize: "24px", color: "#1890ff" }}>Lịch Cá Nhân</h2>
      <Table
        columns={columns}
        dataSource={(listSchedules || []).map((schedule) => ({
          ...schedule,
          id: schedule?._id,
          userCreated: schedule.userCreated?.fullName || "N/A",
          course: schedule?.course?.title || "N/A",
          timeStart: formatDate(schedule?.timeStart) || "N/A",
          timeEnd: formatDate(schedule?.timeEnd) || "N/A",
          type: schedule?.type || "N/A",
        }))}
        loading={isLoadingCategory}
        rowKey="_id"
      />
    </Card>
  );
};

export default Schema;


