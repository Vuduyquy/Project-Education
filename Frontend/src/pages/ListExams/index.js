// import { SearchOutlined } from "@ant-design/icons";
// import {
//   ClockCircleOutlined,
//   LineChartOutlined,
//   QuestionCircleOutlined,
//   StarOutlined,
// } from "@ant-design/icons";
// import { Button, Card, Input, notification } from "antd";
// import React, { useEffect, useState } from "react";
// import { useGetExams } from "../../apis/createExam.api";
// import { useLocation, useNavigate } from "react-router-dom";
// const { Search } = Input;

// const ListExams = () => {
//   const navigate = useNavigate();
//   const [api, contextHolder] = notification.useNotification();
//   const [listExams, setListExams] = useState([]);
//   const [filteredExams, setFilteredExams] = useState([]); // Đề thi đã lọc
//   const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const selectedSubject = queryParams.get("subject"); // Lấy subject từ URL

//   const { data: dataExam } = useGetExams(
//     (data) => {
//       setListExams(data.data);
//       setFilteredExams(data.data); // Lưu ban đầu để hiển thị tất cả đề thi
//     },
//     (error) =>
//       api.error({
//         message: "Không thể tải danh sách đề thi",
//         description: error.message,
//       })
//   );

//   useEffect(() => {
//     if (dataExam) {
//       const allExams = dataExam?.data;
//       if (selectedSubject && selectedSubject !== "all") {
//         setFilteredExams(
//           allExams.filter((exam) =>
//             exam.title.toLowerCase().includes(selectedSubject.toLowerCase())
//           )
//         );
//       } else {
//         setFilteredExams(allExams);
//       }
//     }
//   }, [dataExam, selectedSubject]);

//   console.log("dữ liệu dataExam:", dataExam);

//   // Xử lý khi nhập vào ô tìm kiếm
//   // const handleSearchChange = (e) => {
//   //   const value = e.target.value;
//   //   setSearchTerm(value);
//   //   if (value.trim() === "") {
//   //     setFilteredExams(listExams); // Nếu xóa hết chữ, hiển thị lại toàn bộ đề thi
//   //   } else {
//   //     const filtered = listExams.filter((exam) =>
//   //       exam.title.toLowerCase().includes(value.toLowerCase())
//   //     );
//   //     setFilteredExams(filtered);
//   //   }
//   // };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
    
//     // Kiểm tra xem listExams có tồn tại và có phải là mảng không
//     if (!Array.isArray(listExams)) {
//       console.error("listExams không phải là mảng:", listExams);
//       return;
//     }
    
//     // Log để debug
//     console.log("Danh sách đề thi:", listExams);
//     console.log("Từ khóa tìm kiếm:", value);
    
//     if (value.trim() === "") {
//       setFilteredExams(listExams);
//     } else {
//       try {
//         const searchValue = value.toLowerCase().trim();
        
//         // Kiểm tra cấu trúc của một đề thi để debug
//         if (listExams.length > 0) {
//           console.log("Cấu trúc đề thi mẫu:", JSON.stringify(listExams[0], null, 2));
//         }
        
//         const filtered = listExams.filter((exam) => {
//           // Kiểm tra từng trường một cách an toàn
//           const titleMatch = exam.title ? exam.title.toLowerCase().includes(searchValue) : false;
          
//           // Kiểm tra level (mức độ khó)
//           const levelText = exam.level === 1 ? "cơ bản" : 
//                            exam.level === 2 ? "trung bình" : 
//                            exam.level === 3 ? "khó" : "";
//           const levelMatch = levelText.includes(searchValue);
          
//           // Kiểm tra số lượng câu hỏi
//           const questionsCountMatch = exam.questions && 
//             exam.questions.length.toString().includes(searchValue);
          
//           // Kiểm tra thời gian
//           const durationMatch = exam.duration && 
//             exam.duration.toString().includes(searchValue);
          
//           // Kiểm tra category nếu có
//           const categoryMatch = exam.category ? 
//             exam.category.toLowerCase().includes(searchValue) : false;
          
//           // Kiểm tra description nếu có
//           const descriptionMatch = exam.description ? 
//             exam.description.toLowerCase().includes(searchValue) : false;
          
//           // Kiểm tra tên người tạo nếu có
//           const creatorMatch = exam.createdBy && exam.createdBy.fullName ? 
//             exam.createdBy.fullName.toLowerCase().includes(searchValue) : false;
          
//           // Log kết quả tìm kiếm cho từng đề thi để debug
//           if (titleMatch || levelMatch || questionsCountMatch || 
//               durationMatch || categoryMatch || descriptionMatch || creatorMatch) {
//             console.log(`Đề thi khớp: ${exam.title}`);
//             console.log(`- Tiêu đề khớp: ${titleMatch}`);
//             console.log(`- Mức độ khớp: ${levelMatch}`);
//             console.log(`- Số câu hỏi khớp: ${questionsCountMatch}`);
//             console.log(`- Thời gian khớp: ${durationMatch}`);
//             console.log(`- Thể loại khớp: ${categoryMatch}`);
//             console.log(`- Mô tả khớp: ${descriptionMatch}`);
//             console.log(`- Người tạo khớp: ${creatorMatch}`);
//           }
          
//           // Trả về true nếu bất kỳ trường nào khớp
//           return titleMatch || levelMatch || questionsCountMatch || 
//                  durationMatch || categoryMatch || descriptionMatch || creatorMatch;
//         });
        
//         console.log(`Tìm thấy ${filtered.length} kết quả`);
//         setFilteredExams(filtered);
//       } catch (error) {
//         console.error("Lỗi khi tìm kiếm:", error);
//         // Trong trường hợp lỗi, giữ nguyên danh sách hiện tại
//         setFilteredExams(listExams);
//       }
//     }
//   };

//   return (
//     <>
//       {contextHolder}
//       <Search
//         placeholder="Tìm kiếm đề thi..."
//         enterButton="Search"
//         size="large"
//         value={searchTerm}
//         onChange={handleSearchChange} // Lọc theo thời gian thực
//         allowClear
//       />
//       <button
//         style={{
//           marginTop: "32px",
//           marginBottom: "20px",
//           background: "none",
//           border: "1px solid gray",
//           cursor: "pointer",
//           borderRadius: "8px",
//           backgroundColor: "#1778ff",
//         }}
//       >
//         <h1
//           style={{
//             color: "white",
//             fontSize: "16px",
//             fontWeight: "bold",
//             margin: "10px",
//           }}
//         >
//           Tuyển chọn các đề thi
//         </h1>
//       </button>
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap", // Khi hết chỗ sẽ tự động xuống dòng
//           gap: "16px", // Khoảng cách giữa các Card
//           justifyContent: "center", // Căn giữa nếu không đủ phủ kín
//           maxWidth: "1000px", // Giới hạn chiều rộng để hiển thị tối đa 4 Card
//           margin: "0 auto", // Căn giữa
//         }}
//       >
//         {filteredExams.map((exam, index) => (
//           <Card
//             key={index}
//             style={{
//               width: "100%",
//               maxWidth: "45rem",
//               borderRadius: "8px",
//               boxShadow:
//                 hoveredIndex === index
//                   ? "0 8px 16px rgba(0, 0, 0, 0.15)"
//                   : "0 2px 8px rgba(0, 0, 0, 0.1)",
//               background: "white",
//               transform:
//                 hoveredIndex === index ? "translateY(-5px)" : "translateY(0)",
//               transition: "all 0.3s ease-in-out",
//               cursor: "pointer",
//             }}
//             onMouseEnter={() => setHoveredIndex(index)}
//             onMouseLeave={() => setHoveredIndex(null)}
//           >
//             <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
//               {exam.title}
//             </h2>
//             <div
//               style={{
//                 marginTop: "8px",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               <div
//                 style={{
//                   width: "50px",
//                   height: "50px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   backgroundColor: "#ffb282",
//                   borderRadius: "50%",
//                   border: "1px solid #d9d9d9",
//                   color: "#4B5563",
//                   fontWeight: "bold",
//                 }}
//               >
//                 {exam.title?.charAt(0).toUpperCase()}
//               </div>
//               <div style={{ marginLeft: "26px", flex: 1 }}>
//                 {/* <p style={{ fontWeight: "600" }}>{exam.title}</p> */}
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     color: "#6B7280",
//                     fontSize: "0.875rem",
//                     marginTop: "4px",
//                   }}
//                 >
//                   <QuestionCircleOutlined
//                     style={{ marginRight: "4px", color: "green" }}
//                   />
//                   số lượng câu hỏi: {exam.questions.length}
//                   <ClockCircleOutlined
//                     style={{
//                       marginLeft: "16px",
//                       marginRight: "4px",
//                       color: "red",
//                     }}
//                   />{" "}
//                   thời gian: {exam.duration} phút
//                   {/* <StarOutlined
//                     style={{ marginLeft: "16px", marginRight: "4px", color: "yellow" }}
//                   />{" "}
//                   Điểm cao nhất: {exam.highest_point} */}
//                   <LineChartOutlined
//                     style={{
//                       marginLeft: "16px",
//                       marginRight: "4px",
//                       color: "blue",
//                     }}
//                   />{" "}
//                   Mức độ:{" "}
//                   {exam.level === 1
//                     ? "Cơ bản"
//                     : exam.level === 2
//                     ? "Trung bình"
//                     : "Khó"}
//                 </div>
//               </div>
//               <Button
//                 type="primary"
//                 style={{ marginLeft: "16px" }}
//                 onClick={() => navigate(`${exam._id}`)}
//               >
//                 Thi thử
//               </Button>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </>
//   );
// };

// export default ListExams;


import { SearchOutlined } from "@ant-design/icons";
import {
  ClockCircleOutlined,
  LineChartOutlined,
  QuestionCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useGetExams } from "../../apis/createExam.api";
import { useLocation, useNavigate } from "react-router-dom";
const { Search } = Input;

const ListExams = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [listExams, setListExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedSubject = queryParams.get("subject");

  // Sử dụng useGetExams hook để lấy dữ liệu
  const { data: dataExam, isLoading, error } = useGetExams(
    (data) => {
      console.log("API trả về dữ liệu:", data);
      // Đảm bảo data.data là một mảng
      const examsArray = Array.isArray(data.data) ? data.data : [];
      setListExams(examsArray);
      setFilteredExams(examsArray);
    },
    (error) => {
      console.error("Lỗi khi lấy dữ liệu:", error);
      api.error({
        message: "Không thể tải danh sách đề thi",
        description: error.message,
      });
    }
  );

  // Effect để xử lý khi dataExam thay đổi
  useEffect(() => {
    if (dataExam && dataExam.data) {
      console.log("dataExam thay đổi:", dataExam);
      // Đảm bảo data.data là một mảng
      const examsArray = Array.isArray(dataExam.data) ? dataExam.data : [];
      
      console.log("Số lượng đề thi:", examsArray.length);
      setListExams(examsArray);
      
      // Áp dụng bộ lọc subject nếu có
      if (selectedSubject && selectedSubject !== "all") {
        const filtered = examsArray.filter((exam) =>
          exam.title?.toLowerCase().includes(selectedSubject.toLowerCase())
        );
        console.log("Đề thi đã lọc theo subject:", filtered.length);
        setFilteredExams(filtered);
      } else {
        setFilteredExams(examsArray);
      }
    }
  }, [dataExam, selectedSubject]);

  // Hàm xử lý tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("Giá trị tìm kiếm:", value);
    setSearchTerm(value);
    
    // Nếu không có dữ liệu, không làm gì cả
    if (!Array.isArray(listExams) || listExams.length === 0) {
      console.log("Không có dữ liệu đề thi để tìm kiếm");
      return;
    }
    
    // Nếu xóa hết từ khóa tìm kiếm
    if (value.trim() === "") {
      console.log("Từ khóa trống, hiển thị tất cả đề thi");
      // Áp dụng lại bộ lọc subject nếu có
      if (selectedSubject && selectedSubject !== "all") {
        const filtered = listExams.filter((exam) =>
          exam.title?.toLowerCase().includes(selectedSubject.toLowerCase())
        );
        setFilteredExams(filtered);
      } else {
        setFilteredExams(listExams);
      }
      return;
    }
    
    // Tìm kiếm với từ khóa
    try {
      const searchValue = value.toLowerCase().trim();
      
      const filtered = listExams.filter((exam) => {
        // Kiểm tra từng trường một cách an toàn
        const titleMatch = exam.title ? 
          exam.title.toLowerCase().includes(searchValue) : false;
        
        // Kiểm tra level (mức độ khó)
        const levelText = exam.level === 1 ? "cơ bản" : 
                         exam.level === 2 ? "trung bình" : 
                         exam.level === 3 ? "khó" : "";
        const levelMatch = levelText.includes(searchValue);
        
        // Kiểm tra số lượng câu hỏi
        const questionsCountMatch = exam.questions ? 
          exam.questions.length.toString().includes(searchValue) : false;
        
        // Kiểm tra thời gian
        const durationMatch = exam.duration ? 
          exam.duration.toString().includes(searchValue) : false;
        
        // Kiểm tra category nếu có
        const categoryMatch = exam.category ? 
          (typeof exam.category === 'string' ? 
            exam.category.toLowerCase().includes(searchValue) : 
            (exam.category.title ? 
              exam.category.title.toLowerCase().includes(searchValue) : false)) : 
          false;
        
        // Kiểm tra description nếu có
        const descriptionMatch = exam.description ? 
          exam.description.toLowerCase().includes(searchValue) : false;
        
        // Kiểm tra tên người tạo nếu có
        const creatorMatch = exam.createdBy && exam.createdBy.fullName ? 
          exam.createdBy.fullName.toLowerCase().includes(searchValue) : false;
        
        // Trả về true nếu bất kỳ trường nào khớp
        return titleMatch || levelMatch || questionsCountMatch || 
               durationMatch || categoryMatch || descriptionMatch || creatorMatch;
      });
      
      console.log(`Tìm thấy ${filtered.length} kết quả`);
      setFilteredExams(filtered);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      // Trong trường hợp lỗi, hiển thị thông báo và giữ nguyên danh sách
      api.error({
        message: "Lỗi tìm kiếm",
        description: "Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.",
      });
    }
  };

  // Hàm xử lý khi nhấn nút tìm kiếm
  const handleSearch = (value) => {
    console.log("Tìm kiếm với giá trị:", value);
    // Gọi lại hàm handleSearchChange với event giả
    handleSearchChange({ target: { value } });
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  return (
    <>
      {contextHolder}
      <Search
        placeholder="Tìm kiếm đề thi..."
        enterButton="Search"
        size="large"
        value={searchTerm}
        onChange={handleSearchChange}
        onSearch={handleSearch}
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
          Tuyển chọn các đề thi
        </h1>
      </button>
      
      {/* Hiển thị thông báo nếu không có kết quả */}
      {filteredExams.length === 0 && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <h3>Không tìm thấy đề thi phù hợp</h3>
          <p>Vui lòng thử từ khóa khác hoặc xóa bộ lọc</p>
        </div>
      )}
      
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {filteredExams.map((exam, index) => (
          <Card
            key={exam._id || index}
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
                  border: "1px solid #d9d9d9",
                  color: "#4B5563",
                  fontWeight: "bold",
                }}
              >
                {exam.title?.charAt(0).toUpperCase() || "?"}
              </div>
              <div style={{ marginLeft: "26px", flex: 1 }}>
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
                  số lượng câu hỏi: {exam.questions?.length || 0}
                  <ClockCircleOutlined
                    style={{
                      marginLeft: "16px",
                      marginRight: "4px",
                      color: "red",
                    }}
                  />{" "}
                  thời gian: {exam.duration || 0} phút
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
              <Button
                type="primary"
                style={{ marginLeft: "16px" }}
                onClick={() => navigate(`${exam._id}`)}
              >
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