import {
    Card,
    Input,
    notification,
  } from "antd";
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
import { useGetUserById } from "../../apis/auth.api";
  
  
  const { Search } = Input;
  
  const MyCourses = () => {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [myCourses, setMyCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token");
        console.log('token:', token)
        if (!token) return null;
      
        try {
          const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
          console.log('payloadBase64', payloadBase64)
          const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
          console.log('payload', payload)
          return payload?._id || null;
        } catch (error) {
          console.error("Lỗi giải mã token:", error);
          return null;
        }
      };
  
    // Giả định userId được lưu trong localStorage hoặc context sau khi đăng nhập
    const userId = getUserIdFromToken(); // Thay bằng cách lấy userId thực tế của bạn
    console.log('userId:', userId);
  
    // Sử dụng hook useGetUserById để lấy thông tin người dùng, bao gồm courses
    const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId, {
      onSuccess: (data) => {
        const courses = data.data.courses || []; // Lấy mảng courses từ response
        setMyCourses(courses);
        setFilteredCourses(courses);
      },
      onError: (error) =>
        api.error({
          message: "Không thể tải danh sách khóa học của bạn",
          description: error.message,
        }),
    });
  
    // Cập nhật danh sách khóa học khi dữ liệu thay đổi
    useEffect(() => {
      if (userData) {
        const courses = userData.data.courses || [];
        setMyCourses(courses);
        setFilteredCourses(courses);
      }
    }, [userData]);
  
    // Xử lý tìm kiếm theo thời gian thực
    const handleSearchChange = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      if (value.trim() === "") {
        setFilteredCourses(myCourses); // Hiển thị lại toàn bộ khóa học
      } else {
        const filtered = myCourses.filter((course) =>
          course.title.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCourses(filtered);
      }
    };
  
    return (
      <>
        {contextHolder}
        <Search
          placeholder="Tìm kiếm khóa học của bạn..."
          enterButton="Search"
          size="large"
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
        />
        <div style={{ marginTop: "32px" }}>
          <h1>Khóa học của tôi</h1>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          {isLoadingUser ? (
            <p>Đang tải...</p>
          ) : filteredCourses?.length > 0 ? (
            filteredCourses.map((course) => (
              <Card
                key={course._id}
                hoverable
                style={{
                  width: 240,
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
                cover={
                  <div
                    style={{
                      backgroundColor: "#FFD700",
                      padding: "30px",
                      textAlign: "center",
                    }}
                  >
                    <h2
                      style={{
                        margin: "0",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                    >
                      {course.title}
                    </h2>
                    <p style={{ margin: "8px 0 0", color: "#fff" }}>
                      Đã đăng ký
                    </p>
                  </div>
                }
                onClick={() => navigate(`${course._id}`)}
              >
                <div style={{ padding: "8px" }}>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    {course.title}
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {course.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span>{course.instructorId?.fullName}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p>Số bài giảng:</p>
                      <span>{course.lessons?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p>Bạn chưa đăng ký khóa học nào.</p>
          )}
        </div>
      </>
    );
  };
  
  export default MyCourses;