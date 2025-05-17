import { Card, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useGetCourses } from "../../apis/courses.api";
import { useLocation, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
const { Search } = Input;

// Mảng gradient màu cho từng Card
const gradients = [
  "linear-gradient(to right, #FF6B6B, #A84FFF, #4A90E2)", // Gradient 1
  "linear-gradient(to right, #FF9F55, #D65DB1, #845EC2)", // Gradient 2
  "linear-gradient(to right, #FF6B6B, #4ECDC4, #45B7D1)", // Gradient 3
  "linear-gradient(to right, #FF9A9E, #FAD0C4, #FFD1FF)", // Gradient 4
  "linear-gradient(to right, #6B5B95, #A86B8B, #D4A5A5)", // Gradient 5
];

const Courses = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [listCourses, setListCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedSubject = queryParams.get("subject");

  const { data: courseData, isLoading: isLoadingCourses } = useGetCourses(
    (data) => {
      setListCourses(data);
      setFilteredCourses(data);
    },
    (error) =>
      api.error({
        message: "Không thể tải danh sách khóa học",
        description: error.message,
      })
  );

  useEffect(() => {
    if (courseData) {
      setListCourses(courseData?.data);
      setFilteredCourses(courseData?.data);
    }
  }, [courseData]);

  useEffect(() => {
    if (courseData) {
      const allCourses = courseData?.data;
      if (selectedSubject && selectedSubject !== "all") {
        setFilteredCourses(
          allCourses.filter((course) =>
            course.title.toLowerCase().includes(selectedSubject.toLowerCase())
          )
        );
      } else {
        setFilteredCourses(allCourses);
      }
    }
  }, [courseData, selectedSubject]);

  const fuse = new Fuse(listCourses, {
    keys: [
      "title",
      "category",
      "instructorId.fullName",
      "description"
    ],
    threshold: 0.4, // mức độ mờ (0 = chính xác tuyệt đối, 1 = mờ hoàn toàn)
  });

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchTerm(value);
  
    if (value === "") {
      setFilteredCourses(listCourses);
    } else {
      const results = fuse.search(value);
      const matchedCourses = results.map((result) => result.item);
      setFilteredCourses(matchedCourses);
    }
  };

  // Xử lý lỗi ảnh
  const handleImageError = (e, index) => {
    // Khi ảnh lỗi, sử dụng gradient làm background
    e.target.parentNode.style.background = gradients[index % gradients.length];
    e.target.style.display = "none";
  };

  return (
    <>
      {contextHolder}
      <Search
        placeholder="Tìm kiếm khoá học..."
        enterButton="Search"
        size="large"
        value={searchTerm}
        onChange={handleSearchChange}
        allowClear
      />
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
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        {filteredCourses?.map((course, index) => (
          <Card
            key={course._id || index}
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
            <div style={{ padding: "4px 0px " }}>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
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
                  <span>{course.lessons?.length || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Courses;
