import { Layout, Card, Avatar, Statistic, Row, Col, notification } from "antd";
import {
  UserOutlined,
  BookOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
//import { Line } from '@ant-design/plots';
import { useGetCourses } from "../../../apis/courses.api";
import { useGetExams } from "../../../apis/createExam.api";
import { useGetAllUsers } from "../../../apis/auth.api";

const { Header, Content } = Layout;

// Định nghĩa style cho background
const dashboardStyle = {
  backgroundImage:
    'url("https://media.istockphoto.com/id/1212064060/vi/anh/l%C6%B0%E1%BB%9Bi-lu%E1%BB%93ng-d%E1%BB%AF-li%E1%BB%87u-abs-hologram.jpg?s=612x612&w=0&k=20&c=2IRs6J1TRCQUMzxuPfRK-lyuFKwSKswC8F-Bid526iw=")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100%",
  position: "relative",
};

// Overlay để làm cho nền trong suốt hơn
const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.45)", // Màu trắng với độ trong suốt 15%
  zIndex: 0,
};

// Style cho content để nằm trên overlay
const contentWrapperStyle = {
  position: "relative",
  zIndex: 1,
};

const Dashboard = () => {
  const [listCourses, setListCourses] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [listExams, setListExams] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [hoveredCard1, setHoveredCard1] = useState(null);
  const [hoveredCard2, setHoveredCard2] = useState(null);
  const [hoveredCard3, setHoveredCard3] = useState(null);

  // Hook lấy danh sách khóa học
  const { data: courseData, isLoading: isLoadingCourses } = useGetCourses(
    (data) => setListCourses(data),
    (error) =>
      api.error({
        message: "Không thể tải danh sách khóa học",
        description: error.message,
      })
  );

  useEffect(() => {
    if (courseData) setListCourses(courseData?.data);
  }, [courseData]);

  // Hook để lấy danh sách đề thi
  const { data: examData, isLoading: isLoadingCategory } = useGetExams(
    (data) => {
      setListExams(data.data); // Đảm bảo cập nhật đúng dữ liệu
    },
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (examData) {
      setListExams(examData?.data);
    }
  }, [examData]);

  const { data: userData } = useGetAllUsers(
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

  return (
    <div style={dashboardStyle}>
      {/* Overlay để làm nền trong suốt */}
      <div style={overlayStyle}></div>

      {/* Nội dung chính */}
      <div style={contentWrapperStyle}>
        {contextHolder}
        {/* Header */}
        <Header
          style={{
            background: "transparent",
            padding: 0,
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: 20,
          }}
        >
          <Avatar icon={<UserOutlined />} />
        </Header>

        {/* Content */}
        <Content style={{ margin: "16px" }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card
                hoverable
                onMouseEnter={() => setHoveredCard1("courses")}
                onMouseLeave={() => setHoveredCard1(null)}
                style={{
                  borderRadius: "12px",
                  transform:
                    hoveredCard1 === "courses"
                      ? "translateY(-5px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredCard1 === "courses"
                      ? "0 12px 20px rgba(0, 0, 0, 0.2)"
                      : "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease-in-out",
                  background: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <Statistic
                  title={
                    <span style={{ fontSize: "18px", color: "#1890ff" }}>
                      Số khóa học
                    </span>
                  }
                  value={listCourses.length}
                  prefix={
                    <BookOutlined
                      style={{ fontSize: "24px", color: "#1890ff" }}
                    />
                  }
                  valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                onMouseEnter={() => setHoveredCard2("courses")}
                onMouseLeave={() => setHoveredCard2(null)}
                style={{
                  borderRadius: "12px",
                  transform:
                    hoveredCard2 === "courses"
                      ? "translateY(-5px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredCard2 === "courses"
                      ? "0 12px 20px rgba(0, 0, 0, 0.2)"
                      : "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease-in-out",
                  background: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <Statistic
                  title={
                    <span style={{ fontSize: "18px", color: "#52c41a" }}>
                      Số học viên
                    </span>
                  }
                  value={
                    listUsers.filter((user) => user.role === "student").length
                  }
                  prefix={
                    <UserOutlined
                      style={{ fontSize: "24px", color: "#52c41a" }}
                    />
                  }
                  valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                onMouseEnter={() => setHoveredCard3("courses")}
                onMouseLeave={() => setHoveredCard3(null)}
                style={{
                  borderRadius: "12px",
                  transform:
                    hoveredCard3 === "courses"
                      ? "translateY(-5px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredCard3 === "courses"
                      ? "0 12px 20px rgba(0, 0, 0, 0.2)"
                      : "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease-in-out",
                  background: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <Statistic
                  title={
                    <span style={{ fontSize: "18px", color: "#fa8c16" }}>
                      Số bài kiểm tra
                    </span>
                  }
                  value={listExams.length}
                  prefix={
                    <BarChartOutlined
                      style={{ fontSize: "24px", color: "#fa8c16" }}
                    />
                  }
                  valueStyle={{ color: "#fa8c16", fontWeight: "bold" }}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </div>
    </div>
  );
};

export default Dashboard;
