import { notification, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserQuizzes } from "../../apis/user_quizz.api";

const Transcript = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [listUserQuizz, setListUserQuizz] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Thêm trạng thái cho phân trang
  const [pageSize] = useState(5); // Số bản ghi mỗi trang

  const { data: dataUserQuizz, refetch } = useUserQuizzes(
    currentPage, // Truyền page
    pageSize, // Truyền limit
    (data) => {
      console.log("Dữ liệu từ API useUserQuizzes:", data);
    },
    (error) =>
      api.error({
        message: "Không thể tải danh sách đề thi",
        description: error.message,
      })
  );

  useEffect(() => {
    if (dataUserQuizz) {
      console.log("Danh sách bài thi:", dataUserQuizz.data.data);
      const quizzes = Array.isArray(dataUserQuizz.data.data) ? dataUserQuizz.data.data : [];
      setListUserQuizz(quizzes);
    } else {
      console.log("Không có dữ liệu:", dataUserQuizz);
    }
  }, [dataUserQuizz]);

  const columns = [
    {
      title: "Mã đề thi",
      dataIndex: "idExam",
      key: "idExam",
      render: (idExam) => {
        const shortId = idExam.slice(0, 5);
        return `MĐ_${shortId}`;
      },
    },
    {
      title: "Tên đề thi",
      dataIndex: "title",
      key: "title",
      render: (title) => title || "Không có tên đề thi",
    },
    {
      title: "Thời gian (phút)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };

  const tableStyle = {
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          marginTop: "32px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ color: "black", fontSize: "20px" }}>Bảng điểm cá nhân</h1>
      </div>
      <div style={{ marginTop: "32px", maxHeight: "500px", overflow: "auto" }}>
        <Table
          columns={columns}
          dataSource={
            Array.isArray(listUserQuizz)
              ? listUserQuizz.map((userquizz) => ({
                  key: userquizz._id,
                  idExam: userquizz._id,
                  title: userquizz.quizId?.title || "Đề thi không hợp lệ",
                  duration: userquizz.timeTaken,
                  score: userquizz.score,
                }))
              : []
          }
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: dataUserQuizz?.pagination?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} bài thi`,
            itemRender: (current, type, originalElement) => {
              if (type === "prev") return <a style={{ color: "#1890ff", fontWeight: "bold", padding: "5px 10px" }}>Trước</a>;
              if (type === "next") return <a style={{ color: "#1890ff", fontWeight: "bold", padding: "5px 10px" }}>Sau</a>;
              return originalElement;
            },
          }}
          style={tableStyle}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{ backgroundColor: "#1890ff", color: "white", fontSize: "13px", padding: "12px", textAlign: "center" }}
                />
              ),
            },
          }}
          rowClassName={() => "custom-row"}
          onRow={() => ({
            onMouseEnter: (event) => { event.currentTarget.style.backgroundColor = "#f0f0f0"; event.currentTarget.style.transition = "all 0.3s"; },
            onMouseLeave: (event) => { event.currentTarget.style.backgroundColor = "white"; },
          })}
        />
      </div>
    </>
  );
};

export default Transcript;