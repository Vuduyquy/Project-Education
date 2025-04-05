import { SearchOutlined } from '@ant-design/icons';
import {
	ClockCircleOutlined,
	LineChartOutlined,
	QuestionCircleOutlined,
	StarOutlined,
  } from "@ant-design/icons";
  import {
	Button,
	Card,
	Input,
	notification,
  } from "antd";
  import React, { useEffect, useState } from "react";
  import { useGetExams } from "../../apis/createExam.api";
import { useLocation, useNavigate } from 'react-router-dom';
const { Search } = Input;

const ListExams = () => {
  const navigate = useNavigate();
	const [api, contextHolder] = notification.useNotification();
	const [listExams, setListExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]); // Đề thi đã lọc
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedSubject = queryParams.get("subject"); // Lấy subject từ URL

    const { data: dataExam } = useGetExams(
      (data) => {
        setListExams(data.data);
        setFilteredExams(data.data); // Lưu ban đầu để hiển thị tất cả đề thi
      },
      (error) =>
        api.error({
          message: "Không thể tải danh sách đề thi",
          description: error.message,
        })
    );
  

    useEffect(() => {
      if (dataExam) {
        const allExams = dataExam?.data?.data;
        if (selectedSubject && selectedSubject !== "all") {
          setFilteredExams(
            allExams.filter((exam) =>
              exam.title.toLowerCase().includes(selectedSubject.toLowerCase())
            )
          );
        } else {
          setFilteredExams(allExams);
        }
      }
    }, [dataExam, selectedSubject]);
	  
	  console.log("dữ liệu dataExam:", dataExam);

	// Xử lý khi nhập vào ô tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredExams(listExams); // Nếu xóa hết chữ, hiển thị lại toàn bộ đề thi
    } else {
      const filtered = listExams.filter((exam) =>
        exam.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredExams(filtered);
    }
  };

	return (
		<>
    {contextHolder}
    <Search
        placeholder="Tìm kiếm đề thi..."
        enterButton="Search"
        size="large"
        value={searchTerm}
        onChange={handleSearchChange} // Lọc theo thời gian thực
        allowClear
      />
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
        {filteredExams.map((exam, index) => (
          <Card
            key={index}
            style={{
              width: "100%",
              maxWidth: "50rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{exam.title}</h2>
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
                  <QuestionCircleOutlined style={{ marginRight: "4px" }} />số lượng câu hỏi: {exam.questions.length}
                  <ClockCircleOutlined
                    style={{ marginLeft: "16px", marginRight: "4px" }}
                  />{" "}
                  thời gian: {exam.duration}
                  <StarOutlined
                    style={{ marginLeft: "16px", marginRight: "4px" }}
                  />{" "}
                  Điểm cao nhất: {exam.highest_point*10}
                  <LineChartOutlined
                    style={{ marginLeft: "16px", marginRight: "4px" }}
                  />{" "}
                  Mức độ: {exam.level}
                </div>
              </div>
              <Button type="primary" style={{ marginLeft: "16px" }} onClick={() => navigate(`${exam._id}`)}>
                Thi thử
              </Button>
            </div>
          </Card>
        ))}
      </div>
		</>
	);
};

export default ListExams;
