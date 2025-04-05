import {
  Card,
  Input,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useGetCourses } from "../../apis/courses.api";
import { useLocation, useNavigate } from "react-router-dom";
const { Search } = Input;

const Courses = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [listCourses, setListCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // Danh sách sau khi lọc
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedSubject = queryParams.get("subject"); // Lấy subject từ URL

 // Hook lấy danh sách khóa học
 const { data: courseData, isLoading: isLoadingCourses } = useGetCourses(
  (data) => {
    setListCourses(data);
    setFilteredCourses(data); // Lưu danh sách ban đầu để hiển thị tất cả khóa học
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
    setFilteredCourses(courseData?.data); // Gán lại dữ liệu ban đầu
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

console.log("Dữ liệu courseData:", courseData);

// Xử lý tìm kiếm theo thời gian thực
const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);
  if (value.trim() === "") {
    setFilteredCourses(listCourses); // Nếu xóa hết chữ, hiển thị lại toàn bộ khóa học
  } else {
    const filtered = listCourses.filter((course) =>
      course.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  }
};

  return (
    <>
    <Search
        placeholder="Tìm kiếm khoá học..."
        enterButton="Search"
        size="large"
        value={searchTerm}
        onChange={handleSearchChange} // Lọc theo thời gian thực
        allowClear
      />
			<div style={{ marginTop: "32px" }}>
        <h1>Tuyển chọn các khoá học</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Khi hết chỗ sẽ tự động xuống dòng
          gap: "16px", // Khoảng cách giữa các Card
          justifyContent: "center", // Căn giữa nếu không đủ phủ kín
        }}
      >
        {filteredCourses?.map((course) => (
          <Card
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
                  <span>{course.lessons.length}</span>
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
