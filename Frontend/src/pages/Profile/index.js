// import React, { useContext, useEffect, useState } from "react";
// import { Card, Avatar, Descriptions, Button } from "antd";
// import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
// import "antd/dist/reset.css";
// import { useGetUserById } from "../../apis/auth.api";
// import { AuthContext } from "../../contexts/AuthContext";

// const Profile = () => {
//   const [listUsers, setListUsers] = useState([]);
//   const {
// 	logout: logoutSystem,
// } = useContext(AuthContext);

//   const getUserIdFromToken = () => {
//     const token = localStorage.getItem("token");
//     //console.log("token:", token);
//     if (!token) return null;

//     try {
//       const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
//       //console.log("payloadBase64", payloadBase64);
//       const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
//       //console.log("payload", payload?._id);
//       return payload?._id || null;
//     } catch (error) {
//       console.error("Lỗi giải mã token:", error);
//       return null;
//     }
//   };

//   const userId = getUserIdFromToken();

//   const { data: userData } = useGetUserById(userId, {
//     onSuccess: (data) => {
//       setListUsers(data);
//       console.log("UserData:", data);
//     },
//     onError: (error) => {
//       console.error("Lỗi khi lấy user:", error);
//     },
//   });

//   useEffect(() => {
//     if (userData) {
//       console.log("Dữ liệu userData khi vào trang:", userData);
//       setListUsers(userData?.data);
//     }
//   }, [userData]);
//   console.log("userData:", userData);

//   return (
//     <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
//       <Card
//         style={{ textAlign: "center", borderRadius: 10, overflow: "hidden" }}
//         cover={
//           <div
//             style={{
//               background: "#1890ff",
//               height: 200,
//               position: "relative",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <h1 style={{ color: "white" }}>Thông tin sinh viên</h1>
//             <Avatar
//               size={100}
//               icon={<UserOutlined />}
//               style={{ border: "3px solid white" }}
//             />
//             <h2 style={{ color: "white", marginTop: 10 }}>
//               {listUsers.fullName}
//             </h2>
//           </div>
//         }
//       >
//         <Descriptions column={1} bordered>
//           <Descriptions.Item label="Họ và tên">
//             {listUsers.fullName}
//           </Descriptions.Item>
//           <Descriptions.Item label="Email">{listUsers.email}</Descriptions.Item>
//           <Descriptions.Item label="Khoá học">
//             {Array.isArray(listUsers?.courses) && listUsers.courses.length > 0
//               ? listUsers.courses[0].title
//               : "Không có khoá học"}
//           </Descriptions.Item>
//           <Descriptions.Item label="Môn thi">
//             {Array.isArray(listUsers?.quiz) && listUsers.quiz.length > 0
//               ? listUsers.quiz[0].title
//               : "Không có khoá học"}
//           </Descriptions.Item>
//           <Descriptions.Item label="Vai trò">
//             {listUsers.role}
//           </Descriptions.Item>
//         </Descriptions>
//         <Button
//           type="primary"
//           danger
//           icon={<LogoutOutlined />}
//           style={{ marginTop: 20 }}
// 		  onClick={() => logoutSystem()}
//         >
//           Đăng xuất
//         </Button>
//       </Card>
//     </div>
//   );
// };

// export default Profile;


import React, { useContext, useEffect, useState } from "react";
import { Card, Avatar, Descriptions, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "antd/dist/reset.css";
import { useGetUserById } from "../../apis/auth.api";
import { AuthContext } from "../../contexts/AuthContext";

const Profile = () => {
  const [listUsers, setListUsers] = useState([]);
  const { logout: logoutSystem } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook điều hướng

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
      const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
      console.log('payload:',payload)
      return payload?._id || null;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();
  console.log('userId:', userId)

  const { data: userData } = useGetUserById(userId, {
    onSuccess: (data) => {
      setListUsers(data);
      console.log("UserData:", data);
    },
    onError: (error) => {
      console.error("Lỗi khi lấy user:", error);
    },
  });

  useEffect(() => {
    if (userData) {

      setListUsers(userData?.data);
    }
  }, [userData]);
  console.log('userData', userData)

  const handleLogout = () => {
    logoutSystem(); // Gọi hàm logout
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Card
        style={{ textAlign: "center", borderRadius: 10, overflow: "hidden" }}
        cover={
          <div
            style={{
              background: "#1890ff",
              height: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1 style={{ color: "white" }}>Thông tin sinh viên</h1>
            <Avatar
              size={100}
              icon={<UserOutlined />}
              style={{ border: "3px solid white" }}
            />
            <h2 style={{ color: "white", marginTop: 10 }}>
              {listUsers.fullName}
            </h2>
          </div>
        }
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Họ và tên">
            {listUsers.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{listUsers.email}</Descriptions.Item>
          {/* <Descriptions.Item label="Khoá học">
            {Array.isArray(listUsers?.courses) && listUsers.courses.length > 0
              ? listUsers.courses[0].title
              : "Không có khoá học"}
          </Descriptions.Item>
          <Descriptions.Item label="Môn thi">
            {Array.isArray(listUsers?.quiz) && listUsers.quiz.length > 0
              ? listUsers.quiz[0].title
              : "Không có môn thi"}
          </Descriptions.Item> */}
          <Descriptions.Item label="Vai trò">
            {listUsers.role}
          </Descriptions.Item>
        </Descriptions>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          style={{ marginTop: 20 }}
          onClick={handleLogout} // Gọi hàm logout + điều hướng
        >
          Đăng xuất
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
