import {
  ClockCircleOutlined,
  LineChartOutlined,
  QuestionCircleOutlined,
  StarOutlined,
  StockOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Carousel,
  Input,
  notification,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useGetCourses } from "../../apis/courses.api";
import { useGetExams } from "../../apis/createExam.api";



const { Search } = Input;
const { Meta } = Card;

const Home = () => {
  const [api, contextHolder] = notification.useNotification();
  const [listCourses, setListCourses] = useState([]);
  const [listExams, setListExams] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Hook lấy danh sách khóa học
  const { data: courseData } = useGetCourses(
    (data) => {
      setListCourses(data.data);
      setFilteredCourses(data.data);
    },
    (error) =>
      api.error({
        message: "Không thể tải danh sách khóa học",
        description: error.message,
      })
  );

  // Hook lấy danh sách đề thi
  const { data: dataExam } = useGetExams(
    (data) => {
      setListExams(data.data?.data || []);
      setFilteredExams(data.data?.data || []);
    },
    (error) =>
      api.error({
        message: "Không thể tải danh sách đề thi",
        description: error.message,
      })
  );

  useEffect(() => {
    if (courseData) {
      setListCourses(courseData.data);
      setFilteredCourses(courseData.data);
    }
    if (dataExam) {
      setListExams(dataExam.data?.data);
      setFilteredExams(dataExam.data?.data);
    }
  }, [courseData, dataExam]);

   // Xử lý tìm kiếm theo thời gian thực
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredCourses(listCourses);
      setFilteredExams(listExams);
    } else {
      const filteredCourses = listCourses.filter((course) =>
        course.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filteredCourses);

      const filteredExams = listExams.filter((exam) =>
        exam.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredExams(filteredExams);
    }
  };

  const contentStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    marginTop: "10px",
  };

  return (
    <>
      <Search
        placeholder="Tìm kiếm khoá học, bài viết, video, ..."
        enterButton="Search"
        size="large"
        value={searchTerm}
        onChange={handleSearchChange}
        allowClear
      />
      <Carousel arrows infinite={false}>
        <div>
          <img
            src="https://tuyensinh.uit.edu.vn/sites/default/files/uploads/images/201803/31-12-2017-cong-bo-10-su-kien-cong-nghe-thong-tin-truyen-thong-tieu-bieu-nam-2017-22904cea-details.jpg"
            alt="Slide 1"
            style={contentStyle}
          />
        </div>
        <div>
          <img
            src="https://cdbp.edu.vn/uploads/tuyensinh/2023_01/nganh-cntt-1-1.jpg"
            alt="Slide 1"
            style={contentStyle}
          />
        </div>
        <div>
          <img
            src="https://daotaodaihoc.net/uploads/news/2023_10/cong-nghe-thong-tin-la-gi.png"
            alt="Slide 1"
            style={contentStyle}
          />
        </div>
        <div>
          <img
            src="https://s3-ap-southeast-1.amazonaws.com/cdtd-bucket/wp-content/uploads/2022/11/29210301/Nganh-Ung-dung-phan-mem-1-750x500.jpg"
            alt="Slide 1"
            style={contentStyle}
          />
        </div>
      </Carousel>

      <div style={{ marginTop: "32px", marginBottom: "20px" }}>
        <h1>Tuyển chọn các Khoá học</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Khi hết chỗ sẽ tự động xuống dòng
          gap: "16px", // Khoảng cách giữa các Card
          justifyContent: "center", // Căn giữa nếu không đủ phủ kín
          maxWidth: "1000px", // Giới hạn chiều rộng để hiển thị tối đa 4 Card
          margin: "0 auto", // Căn giữa
        }}
      >
        {filteredCourses?.slice(0, 4).map((course) => (
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
                  {course.title} <span style={{ fontWeight: "lighter" }}></span>
                </h2>
                <p style={{ margin: "8px 0 0", color: "#fff" }}>
                  Cho người mới bắt đầu
                </p>
              </div>
            }
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
                  <span>{course.lessons.length}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: "32px" }}>
        <h1>Tuyển chọn các đề thi</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Khi hết chỗ sẽ tự động xuống dòng
          gap: "16px", // Khoảng cách giữa các Card
          justifyContent: "center", // Căn giữa nếu không đủ phủ kín
          maxWidth: "1000px", // Giới hạn chiều rộng để hiển thị tối đa 4 Card
          margin: "0 auto", // Căn giữa
        }}
      >
        {filteredExams.map((exam) => (
          <Card
            key={exam._id}
            style={{
              width: "100%",
              maxWidth: "50rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
              {exam.title}
            </h2>
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#E5E7EB",
                  borderRadius: "50%",
                  color: "#4B5563",
                  fontWeight: "bold",
                }}
              >
                {exam.title?.charAt(0).toUpperCase()}
              </div>
              <div style={{ marginLeft: "16px", flex: 1 }}>
                {/* <p style={{ fontWeight: "600" }}>{exam.title}</p> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    marginTop: "4px",
                  }}
                >
                  <QuestionCircleOutlined style={{ marginRight: "4px" }} />
                  số lượng câu hỏi: {exam.questions ? exam.questions.length : 0}
                  <ClockCircleOutlined
                    style={{ marginLeft: "16px", marginRight: "4px" }}
                  />{" "}
                  thời gian: {exam.duration}
                  <StarOutlined
                    style={{ marginLeft: "16px", marginRight: "4px" }}
                  />{" "}
                  Điểm cao nhất: {exam.highest_point * 10}
                  <LineChartOutlined
                    style={{ marginLeft: "16px", marginRight: "4px" }}
                  />{" "}
                  Mức độ: {exam.level}
                </div>
              </div>
              <Button type="primary" style={{ marginLeft: "16px" }}>
                Thi thử
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Home;
