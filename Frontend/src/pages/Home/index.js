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
import { useNavigate } from "react-router-dom";
const { Search } = Input;
const { Meta } = Card;

const gradients = [
  "linear-gradient(to right, #FF6B6B, #A84FFF, #4A90E2)", // Gradient 1
  "linear-gradient(to right, #FF9F55, #D65DB1, #845EC2)", // Gradient 2
  "linear-gradient(to right, #FF6B6B, #4ECDC4, #45B7D1)", // Gradient 3
  "linear-gradient(to right, #FF9A9E, #FAD0C4, #FFD1FF)", // Gradient 4
  "linear-gradient(to right, #6B5B95, #A86B8B, #D4A5A5)", // Gradient 5
];

const Home = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [listCourses, setListCourses] = useState([]);
  const [listExams, setListExams] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
      setListExams(data.data || []);
      setFilteredExams(data.data || []);
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
      setListExams(dataExam.data);
      setFilteredExams(dataExam.data);
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

  // Xử lý lỗi ảnh
  const handleImageError = (e, index) => {
    // Khi ảnh lỗi, sử dụng gradient làm background
    e.target.parentNode.style.background = gradients[index % gradients.length];
    e.target.style.display = "none";
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
      <Carousel arrows autoplay autoplaySpeed={2000} infinite={true}>
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

      <button
        style={{
          marginTop: "32px",
          marginBottom: "20px",
          background: "none",
          border: "1px solid gray",
          cursor: "pointer",
          borderRadius: "8px",
          backgroundColor: "#1778ff",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            margin: "10px",
          }}
        >
          Tuyển chọn các khoá học
        </h1>
      </button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Khi hết chỗ sẽ tự động xuống dòng
          gap: "16px", // Khoảng cách giữa các Card
          justifyContent: "center", // Căn giữa nếu không đủ phủ kín
          maxWidth: "1024px", // Giới hạn chiều rộng để hiển thị tối đa 4 Card
          margin: "0 auto", // Căn giữa
        }}
      >
        {filteredCourses?.map((course, index) => (
          <Card
            hoverable
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              width: 240,
              borderRadius: "8px",
              overflow: "hidden",
              height: 300,
              display: "flex",
              flexDirection: "column",
              transform:
                hoveredIndex === index ? "translateY(-5px)" : "translateY(0)",
              boxShadow:
                hoveredIndex === index
                  ? "0 8px 16px rgba(0, 0, 0, 0.2)"
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
              cursor: "pointer",
            }}
            cover={
              <div
                style={{
                  background: course.image
                    ? "white"
                    : gradients[index % gradients.length],
                  padding: "0",
                  textAlign: "center",
                  height: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => handleImageError(e, index)}
                  />
                ) : (
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
                )}
              </div>
            }
            onClick={() => navigate(`${course._id}`)}
          >
            <div style={{ padding: "8px" }}>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  // marginBottom: "8px",
                  color: "red",
                }}
              >
                {course.title}
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Thể loại:{" "}
                <span style={{ color: "#ff6b1c", fontSize: "12px" }}>
                  {course.category}
                </span>
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "38px",
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
      <button
        style={{
          marginTop: "32px",
          marginBottom: "20px",
          background: "none",
          border: "1px solid gray",
          cursor: "pointer",
          borderRadius: "8px",
          backgroundColor: "#1778ff",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            margin: "10px",
          }}
        >
          Tuyển chọn các đề thi
        </h1>
      </button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Khi hết chỗ sẽ tự động xuống dòng
          gap: "20px ", // Khoảng cách giữa các Card
          justifyContent: "center", // Căn giữa nếu không đủ phủ kín
          maxWidth: "1024px", // Giới hạn chiều rộng để hiển thị tối đa 4 Card
          margin: "0 auto", // Căn giữa
        }}
      >
        {filteredExams.map((exam, index) => (
          <Card
            key={index}
            style={{
              width: "100%",
              maxWidth: "45rem",
              borderRadius: "8px",
              boxShadow:
                hoveredIndex === index
                  ? "0 8px 16px rgba(0, 0, 0, 0.15)"
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
              background: "white",
              transform:
                hoveredIndex === index ? "translateY(-5px)" : "translateY(0)",
              transition: "all 0.3s ease-in-out",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
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
                  backgroundColor: "#ffb282",
                  borderRadius: "50%",
                  color: "#4B5563",
                  fontWeight: "bold",
                }}
              >
                {exam.title?.charAt(0).toUpperCase()}
              </div>
              <div style={{ marginLeft: "26px", flex: 1 }}>
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
                  <QuestionCircleOutlined
                    style={{ marginRight: "4px", color: "green" }}
                  />
                  số lượng câu hỏi: {exam.questions ? exam.questions.length : 0}
                  <ClockCircleOutlined
                    style={{
                      marginLeft: "16px",
                      marginRight: "4px",
                      color: "red",
                    }}
                  />{" "}
                  thời gian: {exam.duration} phút
                  {/* <StarOutlined
                    style={{ marginLeft: "16px", marginRight: "4px", color: "yellow" }}
                  />{" "}
                  Điểm cao nhất: {exam.highest_point * 10} */}
                  <LineChartOutlined
                    style={{
                      marginLeft: "16px",
                      marginRight: "4px",
                      color: "blue",
                    }}
                  />{" "}
                  Mức độ:{" "}
                  {exam.level === 1
                    ? "Cơ bản"
                    : exam.level === 2
                    ? "Trung bình"
                    : "Khó"}
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
