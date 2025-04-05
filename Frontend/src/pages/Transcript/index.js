// // import { notification, Table } from "antd";
// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useUserQuizzes } from "../../apis/user_quizz.api";

// // const Transcript = () => {
// //   const navigate = useNavigate();
// //   const [api, contextHolder] = notification.useNotification();
// //   const [listUserQuizz, setListUserQuizz] = useState([]);
// //   //hook lấy danh sách đề thi
// //   const { data: dataUserQuizz } = useUserQuizzes(
// //     (data) => setListUserQuizz(data.data),
// //     (error) =>
// //       api.error({
// //         message: "Không thể tải danh sách đề thi",
// //         description: error.message,
// //       })
// //   );

// //   useEffect(() => {
// //     if (dataUserQuizz) {
// //       setListUserQuizz(dataUserQuizz?.data?.data);
// //     }
// //   }, [dataUserQuizz]);

// //   console.log("dữ liệu dataUserQuizz:", dataUserQuizz);

// //   const columns = [
// //     {
// //       title: "Mã đề thi",
// //       dataIndex: "idExam",
// //       key: "idExam",
// //     },
// //     {
// //       title: "Tên đề thi",
// //       dataIndex: "title",
// //       key: "title",
// //     },
// //     {
// //       title: "Thời gian",
// //       dataIndex: "duration",
// //       key: "duration",
// //     },
// //     {
// //       title: "Điểm",
// //       dataIndex: "score",
// //       key: "score",
// //     },
// //   ];


// //   return (
// //     <>
// //       <div
// //         style={{
// //           marginTop: "32px",
// //           display: "flex",
// //           justifyContent: "space-between",
// //         }}
// //       >
// //         <h1>Bảng điểm cá nhân</h1>
// //       </div>
// //       <div style={{ marginTop: "32px" }}>
// //         <Table
// //           columns={columns}
// //           dataSource={
// //             listUserQuizz.map((userquizz) => ({
// //               key: userquizz._id,
// // 			         idExam: userquizz._id,
// //               //category: userquizz.quizId.category.title,
// //               title: userquizz.quizId.title,
// //               duration: userquizz.quizId.duration,
// //               score: userquizz.score * 10
// //             })) || []
// //           }
// //         />
// //       </div>
// //     </>
// //   );
// // };

// // export default Transcript;


// import { notification, Table } from "antd";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserQuizzes } from "../../apis/user_quizz.api";


// const Transcript = () => {
//   const navigate = useNavigate();
//   const [api, contextHolder] = notification.useNotification();
//   const [listUserQuizz, setListUserQuizz] = useState([]);

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

//   // Hook lấy danh sách đề thi
//   const { data: dataUserQuizz } = useUserQuizzes(
//     (data) => setListUserQuizz(data.data),
//     (error) =>
//       api.error({
//         message: "Không thể tải danh sách đề thi",
//         description: error.message,
//       })
//   );

//   useEffect(() => {
//     if (dataUserQuizz && userId) {
//       // Lọc danh sách chỉ lấy bài thi của người dùng hiện tại
//       const userQuizzes = dataUserQuizz.data.data.filter(
//         (quiz) => quiz.userId === userId
//       );
//       setListUserQuizz(userQuizzes);
//     }
//   }, [dataUserQuizz, userId]);

//   console.log("Danh sách bài thi của người dùng:", listUserQuizz);

//   const columns = [
//     {
//       title: "Mã đề thi",
//       dataIndex: "idExam",
//       key: "idExam",
//     },
//     {
//       title: "Tên đề thi",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "Thời gian(giây)",
//       dataIndex: "duration",
//       key: "duration",
//     },
//     {
//       title: "Điểm",
//       dataIndex: "score",
//       key: "score",
//     },
//   ];

//   return (
//     <>
//       {contextHolder}
//       <div
//         style={{
//           marginTop: "32px",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <h1>Bảng điểm cá nhân</h1>
//       </div>
//       <div style={{ marginTop: "32px" }}>
//         <Table
//           columns={columns}
//           dataSource={
//             listUserQuizz.map((userquizz) => ({
//               key: userquizz._id,
//               idExam: userquizz._id,
//               title: userquizz.quizId.title,
//               duration: userquizz.timeTaken,
//               score: userquizz.score * 10,
//             })) || []
//           }
//         />
//       </div>
//     </>
//   );
// };

// export default Transcript;

import { notification, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserQuizzes } from "../../apis/user_quizz.api";

const Transcript = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [listUserQuizz, setListUserQuizz] = useState([]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token trong localStorage");
      return null;
    }

    try {
      const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
      const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
      console.log("User ID từ token:", payload?._id);
      return payload?._id || null;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  // Hook lấy danh sách đề thi
  const { data: dataUserQuizz } = useUserQuizzes(
    (data) => {
      console.log("Dữ liệu từ API useUserQuizzes:", data.data);
    },
    (error) =>
      api.error({
        message: "Không thể tải danh sách đề thi",
        description: error.message,
      })
  );

  useEffect(() => {
    if (dataUserQuizz && userId) {
      // Lọc danh sách chỉ lấy bài thi của người dùng hiện tại
      const userQuizzes = dataUserQuizz.data.data.filter(
        (quiz) => quiz.userId === userId
      );
      console.log("Danh sách bài thi sau khi lọc:", userQuizzes);
      setListUserQuizz(userQuizzes);
    } else {
      console.log("Không có dữ liệu hoặc userId không hợp lệ:", { dataUserQuizz, userId });
    }
  }, [dataUserQuizz, userId]);

  const columns = [
    {
      title: "Mã đề thi",
      dataIndex: "idExam",
      key: "idExam",
      render: (idExam) => {
        const shortId = idExam.slice(0, 5); // Lấy 8 ký tự đầu tiên
        return `MĐ_${shortId}`; // Thêm tiền tố EXAM-
      },
    },
    {
      title: "Tên đề thi",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Thời gian (giây)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
    },
  ];

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
        <h1>Bảng điểm cá nhân</h1>
      </div>
      <div style={{ marginTop: "32px" }}>
        <Table
          columns={columns}
          dataSource={
            listUserQuizz.map((userquizz) => ({
              key: userquizz._id,
              idExam: userquizz._id,
              title: userquizz.quizId?.title,
              duration: userquizz.timeTaken,
              score: userquizz.score * 10,
            })) || []
          }
        />
      </div>
    </>
  );
};

export default Transcript;