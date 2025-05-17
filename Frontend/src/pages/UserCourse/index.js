// import {
//     Card,
//     Input,
//     notification,
//   } from "antd";
//   import React, { useEffect, useState } from "react";
//   import { useNavigate } from "react-router-dom";
// import { useGetUserById } from "../../apis/auth.api";
  
  
//   const { Search } = Input;

//   // Mảng gradient màu cho từng Card
// const gradients = [
//   "linear-gradient(to right, #FF6B6B, #A84FFF, #4A90E2)", // Gradient 1
//   "linear-gradient(to right, #FF9F55, #D65DB1, #845EC2)", // Gradient 2
//   "linear-gradient(to right, #FF6B6B, #4ECDC4, #45B7D1)", // Gradient 3
//   "linear-gradient(to right, #FF9A9E, #FAD0C4, #FFD1FF)", // Gradient 4
//   "linear-gradient(to right, #6B5B95, #A86B8B, #D4A5A5)", // Gradient 5
// ];

// // Style cho background
// const pageStyle = {
//   backgroundImage: 'url("https://img.freepik.com/free-vector/abstract-white-shapes-background_79603-1362.jpg")',
//   backgroundSize: 'cover',
//   backgroundPosition: 'center',
//   backgroundRepeat: 'no-repeat',
//   minHeight: '100vh',
//   position: 'relative',
//   padding: '20px',
// };

// // Overlay để làm cho nền trong suốt
// const overlayStyle = {
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: 'rgba(255, 255, 255, 0.7)', // Màu trắng với độ trong suốt 30%
//   zIndex: 0,
// };

// // Style cho content để nằm trên overlay
// const contentWrapperStyle = {
//   position: 'relative',
//   zIndex: 1,
// };
  
//   const MyCourses = () => {
//     const navigate = useNavigate();
//     const [api, contextHolder] = notification.useNotification();
//     const [myCourses, setMyCourses] = useState([]);
//     const [filteredCourses, setFilteredCourses] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");

//     const getUserIdFromToken = () => {
//         const token = localStorage.getItem("token");
//         //console.log('token:', token)
//         if (!token) return null;
      
//         try {
//           const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
//           //console.log('payloadBase64', payloadBase64)
//           const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
//           //console.log('payload', payload)
//           return payload?._id || null;
//         } catch (error) {
//           //console.error("Lỗi giải mã token:", error);
//           return null;
//         }
//       };
  
//     // Giả định userId được lưu trong localStorage hoặc context sau khi đăng nhập
//     const userId = getUserIdFromToken(); // Thay bằng cách lấy userId thực tế của bạn
//     //console.log('userId:', userId);
  
//     // Sử dụng hook useGetUserById để lấy thông tin người dùng, bao gồm courses
//     const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId, {
//       onSuccess: (data) => {
//         const courses = data.data.courses || []; // Lấy mảng courses từ response
//         setMyCourses(courses);
//         setFilteredCourses(courses);
//       },
//       onError: (error) =>
//         api.error({
//           message: "Không thể tải danh sách khóa học của bạn",
//           description: error.message,
//         }),
//     });
  
//     // Cập nhật danh sách khóa học khi dữ liệu thay đổi
//     useEffect(() => {
//       if (userData) {
//         const courses = userData.data.courses || [];
//         console.log('courses:', courses)
//         setMyCourses(courses);
//         setFilteredCourses(courses);
//       }
//     }, [userData]);
  
//     // Xử lý tìm kiếm theo thời gian thực
//     const handleSearchChange = (e) => {
//       const value = e.target.value;
//       setSearchTerm(value);
//       if (value.trim() === "") {
//         setFilteredCourses(myCourses); // Hiển thị lại toàn bộ khóa học
//       } else {
//         const filtered = myCourses.filter((course) =>
//           course.title.toLowerCase().includes(value.toLowerCase())
//         );
//         setFilteredCourses(filtered);
//       }
//     };

//      // Xử lý lỗi ảnh
//   const handleImageError = (e, index) => {
//     // Khi ảnh lỗi, sử dụng gradient làm background
//     e.target.parentNode.style.background = gradients[index % gradients.length];
//     e.target.style.display = 'none';
//   };
  
//     return (
//       <div style={pageStyle}>
//         <div style={overlayStyle}></div>
//         <div style={contentWrapperStyle}>
//           {contextHolder}
//           <Search
//             placeholder="Tìm kiếm khóa học của bạn..."
//             enterButton="Search"
//             size="large"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             allowClear
//             style={{ marginBottom: '20px' }}
//           />
//           <button style={{ marginTop: "32px", marginBottom: "20px", background: "none", border: "1px solid gray", cursor: "pointer", borderRadius: "8px", backgroundColor: "#1778ff" }}>
//             <h1 style={{ color: "white", fontSize: "16px", fontWeight: "bold", margin: "10px" }}>Khoá học của tôi</h1>
//           </button>
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: "16px",
//               justifyContent: "center",
//             }}
//           >
//             {isLoadingUser ? (
//               <p>Đang tải...</p>
//             ) : filteredCourses?.length > 0 ? (
//               filteredCourses.map((course, index) => (
//                 <Card
//                   key={course._id || index}
//                   hoverable
//                   style={{
//                     width: 240,
//                     borderRadius: "8px",
//                     overflow: "hidden",
//                     boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//                     backgroundColor: "white",
//                   }}
//                   cover={
//                     <div
//                   style={{
//                     background: course.image ? "white" : gradients[index % gradients.length],
//                     padding: "0",
//                     textAlign: "center",
//                     height: 120,
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {course.image ? (
//                     <img
//                       src={course.image}
//                       alt={course.title}
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                       onError={(e) => handleImageError(e, index)}
//                     />
//                   ) : (
//                     <h2
//                       style={{
//                         margin: "0",
//                         color: "#fff",
//                         fontWeight: "bold",
//                         fontSize: "20px",
//                       }}
//                     >
//                       {course.title}
//                     </h2>
//                   )}
//                 </div>
//                   }
//                   onClick={() => navigate(`${course._id}`)}
//                 >
//                   <div style={{ padding: "8px" }}>
//                 <p
//                   style={{
//                     fontSize: "16px",
//                     fontWeight: "bold",
//                     marginBottom: "8px",
//                     color: "red",
//                   }}
//                 >
//                   {course.title}
//                 </p>
//                 <p
//                   style={{
//                     margin: "0",
//                     fontSize: "10px",
//                     fontWeight: "bold",
//                     color: "black",
//                   }}
//                 >
//                   {course.description}
//                 </p>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginTop: "38px",
//                   }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <span>{course.instructorId.fullName}</span>
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <p>Số bài giảng:</p>
//                     <span>{course.lessons?.length || 0}</span>
//                   </div>
//                 </div>
//               </div>
//                 </Card>
//               ))
//             ) : (
//               <div style={{ 
//                 padding: "20px", 
//                 backgroundColor: "rgba(255,255,255,0.8)", 
//                 borderRadius: "8px",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
//               }}>
//                 <p style={{ fontSize: "16px" }}>Bạn chưa đăng ký khóa học nào.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default MyCourses;


import { Card, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserById } from "../../apis/auth.api";

const { Search } = Input;

// Mảng gradient màu cho từng Card
const gradients = [
  "linear-gradient(to right, #FF6B6B, #A84FFF, #4A90E2)", // Gradient 1
  "linear-gradient(to right, #FF9F55, #D65DB1, #845EC2)", // Gradient 2
  "linear-gradient(to right, #FF6B6B, #4ECDC4, #45B7D1)", // Gradient 3
  "linear-gradient(to right, #FF9A9E, #FAD0C4, #FFD1FF)", // Gradient 4
  "linear-gradient(to right, #6B5B95, #A86B8B, #D4A5A5)", // Gradient 5
];

// Style cho background
const pageStyle = {
  backgroundImage: 'url("https://img.freepik.com/free-vector/abstract-white-shapes-background_79603-1362.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
  position: "relative",
  padding: "20px",
};

// Overlay để làm cho nền trong suốt
const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.7)", // Màu trắng với độ trong suốt 30%
  zIndex: 0,
};

// Style cho content để nằm trên overlay
const contentWrapperStyle = {
  position: "relative",
  zIndex: 1,
};

const MyCourses = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [myCourses, setMyCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
      console.log("payloadBase64", payloadBase64);
      const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
      console.log("payload", payload);
      return payload?._id || null;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  // Giả định userId được lưu trong localStorage hoặc context sau khi đăng nhập
  const userId = getUserIdFromToken(); // Thay bằng cách lấy userId thực tế của bạn
  console.log("userId:", userId);

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

  // Xử lý lỗi ảnh
  const handleImageError = (e, index) => {
    // Khi ảnh lỗi, sử dụng gradient làm background
    e.target.parentNode.style.background = gradients[index % gradients.length];
    e.target.style.display = "none";
  };

  return (
    <div style={pageStyle}>
      <div style={overlayStyle}></div>
      <div style={contentWrapperStyle}>
        {contextHolder}
        <Search
          placeholder="Tìm kiếm khóa học của bạn..."
          enterButton="Search"
          size="large"
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
          style={{ marginBottom: "20px" }}
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
            Khoá học của tôi
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
          {isLoadingUser ? (
            <p>Đang tải...</p>
          ) : filteredCourses?.length > 0 ? (
            filteredCourses.map((course, index) => (
              <Card
                key={course._id || index}
                hoverable
                style={{
                  width: 240,
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
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
                    {course.description}
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
            ))
          ) : (
            <div
              style={{
                padding: "20px",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <p style={{ fontSize: "16px" }}>
                Bạn chưa đăng ký khóa học nào.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;