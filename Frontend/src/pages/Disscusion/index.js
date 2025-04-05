// import React, { useEffect, useState } from "react";
// import { List, Card, Input, Button, Avatar, Select, Tag, notification } from "antd";
// import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import { useGetCourses } from "../../apis/courses.api";
// import { useGetDiscussionsByCourse, useCreateDiscussion, useAddAnswer } from "../../apis/disscusion.api";

// const { TextArea } = Input;
// const { Option } = Select;

// const Disscusion = () => {
//   const [api, contextHolder] = notification.useNotification();
//   const [newQuestion, setNewQuestion] = useState("");
//   const [newComment, setNewComment] = useState({});
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [listCourses, setListCourses] = useState([]);
//   const [discussions, setDiscussions] = useState();

//   const { data: courseData } = useGetCourses(
//     (data) => {
//       setListCourses(data?.data || []);
//       if (data?.data?.length > 0) setSelectedCourse(data.data[0]._id);
//     },
//     (error) => api.error({ message: "Không thể tải danh sách khóa học", description: error.message })
//   );
//     useEffect(() => {
//     if (courseData) {
// 		setListCourses(courseData?.data || []);
// 		if (courseData?.data?.length > 0) {
// 		  setSelectedCourse(courseData.data[0]._id);
// 		}
// 	  }  
//   }, [courseData]);
//   console.log("Dữ liệu courseData:", courseData);

//   const { data: discussionsData, refetch } = useGetDiscussionsByCourse(selectedCourse);
//   console.log('discusionData:', discussionsData)

//   const { mutate: createDiscussion } = useCreateDiscussion(() => {
//     api.success({ message: "Gửi câu hỏi thành công!" });
//     setNewQuestion("");
//     refetch(); // Cập nhật danh sách câu hỏi
//   });

//   const { mutate: addAnswer } = useAddAnswer(() => {
//     api.success({ message: "Gửi câu trả lời thành công!" });
//     setNewComment({});
//     refetch(); // Cập nhật danh sách thảo luận
//   });

//     const handleAddQuestion = () => {
// 	if (!newQuestion.trim() || !selectedCourse) return;
	
// 	const course = listCourses.find((c) => c._id === selectedCourse);
// 	const newDiscussion = {
// 	  courseId: selectedCourse,
// 	  courseName: course?.title || "Unknown Course",
// 	  userId,
// 	  question: newQuestion,
// 	  answers: [],
// 	  isClose: false,
// 	  createdAt: new Date(),
// 	  updatedAt: new Date(),
// 	};
  
// 	// Gửi câu hỏi lên API
// 	createDiscussion(newDiscussion, {
// 	  onSuccess: (data) => {
// 		setDiscussions([...discussions, { ...newDiscussion, _id: data._id }]);
// 		setNewQuestion("");
// 		api.success({ message: "Gửi câu hỏi thành công!" });
// 	  },
// 	  onError: (error) => {
// 		api.error({
// 		  message: "Lỗi khi gửi câu hỏi",
// 		  description: error.message,
// 		});
// 	  },
// 	});
//   };


//   const handleAddComment = (id) => {
//     if (!newComment[id]) return;
//     addAnswer({ id, payload: { userId: getUserIdFromToken(), answer: newComment[id] } });
//   };

//   const getUserIdFromToken = () => {
//     const token = localStorage.getItem("token");
//     if (!token) return null;
//     try {
//       const payloadBase64 = token.split(".")[1];
//       const payload = JSON.parse(atob(payloadBase64));
// 	  console.log("payload:", payload);
//       return payload?._id ;
//     } catch (error) {
//       console.error("Lỗi giải mã token:", error);
//       return null;
//     }
//   };

//   const userId = getUserIdFromToken();

//   return (
//     <div style={{ maxWidth: 800, margin: "20px auto" }}>
//       {contextHolder}
//       <Card title="Đặt câu hỏi thảo luận cho khoá học">
//         <Select value={selectedCourse} onChange={setSelectedCourse} style={{ width: "100%", marginBottom: 10 }}>
//           {listCourses.map((course) => (
//             <Option key={course._id} value={course._id}>
//               {course.title}
//             </Option>
//           ))}
//         </Select>
//         <TextArea rows={2} placeholder="Nhập câu hỏi của bạn..." value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
//         <Button type="primary" onClick={handleAddQuestion} style={{ marginTop: 8 }}>
//           Gửi câu hỏi
//         </Button>
//       </Card>
//       {/* <List
//         dataSource={discussionsData || []}
//         renderItem={(item) => (
//           <Card
//             title={
//               <>
//                 <Avatar icon={<UserOutlined />} /> {item.userId.fullName} hỏi trong <b>{item.courseId.title}</b>
//                 {item.isClose && (
//                   <Tag color="red" style={{ marginLeft: 10 }}>
//                     <LockOutlined /> Đã đóng
//                   </Tag>
//                 )}
//               </>
//             }
//             style={{ marginBottom: 16, borderLeft: item.isClose ? "4px solid red" : "4px solid green" }}
//           >
//             <p>{item.question}</p>
//             <List
//               dataSource={item.answers}
//               renderItem={(answer) => (
//                 <Card.Grid style={{ width: "100%" }}>
//                   <p>
//                     <b>{answer.userId.fullName}:</b> {answer.answer}
//                   </p>
//                 </Card.Grid>
//               )}
//             />
//             {!item.isClose ? (
//               <>
//                 <TextArea rows={2} placeholder="Nhập câu trả lời..." value={newComment[item._id] || ""} onChange={(e) => setNewComment({ ...newComment, [item._id]: e.target.value })} />
//                 <Button type="primary" onClick={() => handleAddComment(item._id)} style={{ marginTop: 8 }}>
//                   Gửi
//                 </Button>
//               </>
//             ) : (
//               <p style={{ color: "red", fontStyle: "italic" }}>Thảo luận này đã đóng, không thể trả lời.</p>
//             )}
//           </Card>
//         )}
//       /> */}
//       {listCourses.map((course) => (
//         <Card key={course._id} title={course.title} style={{ marginTop: 20 }}>
//           <List
//             dataSource={(discussionsData || []).filter(d => d.courseId._id === course._id)}
//             renderItem={(item) => (
//               <Card style={{ marginBottom: 16 }}>
//                 <p><Avatar icon={<UserOutlined />} /> <b>{item.userId?.fullName}</b> hỏi:</p>
//                 <p>{item.question}</p>
//                 <List
//                   dataSource={item.answers}
//                   renderItem={(answer) => (
//                     <Card.Grid style={{ width: "100%" }}>
//                       <p><b>{answer.userId?.fullName}:</b> {answer.answer}</p>
//                     </Card.Grid>
//                   )}
//                 />
//                 {!item.isClose ? (
//                   <>
//                     <TextArea rows={2} placeholder="Nhập câu trả lời..." value={newComment[item._id] || ""} onChange={(e) => setNewComment({ ...newComment, [item._id]: e.target.value })} />
//                     <Button type="primary" onClick={() => handleAddComment(item._id)} style={{ marginTop: 8 }}>Gửi</Button>
//                   </>
//                 ) : (
//                   <Tag color="red"><LockOutlined /> Đã đóng</Tag>
//                 )}
//               </Card>
//             )}
//           />
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default Disscusion;

import React, { useEffect, useState } from "react";
import { List, Card, Input, Button, Avatar, Select, Tag, notification, Space } from "antd";
import { UserOutlined, LockOutlined, SendOutlined } from "@ant-design/icons";
import { useGetCourses } from "../../apis/courses.api";
import { useGetDiscussionsByCourse, useCreateDiscussion, useAddAnswer } from "../../apis/disscusion.api";
import axios from "axios"; // Import axios để gọi backend

const { TextArea } = Input;
const { Option } = Select;

const Disscusion = () => {
  const [api, contextHolder] = notification.useNotification();
  const [newQuestion, setNewQuestion] = useState("");
  const [newComment, setNewComment] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [listCourses, setListCourses] = useState([]);
  const [discussions, setDiscussions] = useState();

  // State cho phần chat với AI
  const [chatMessages, setChatMessages] = useState([]); // Danh sách tin nhắn
  const [chatInput, setChatInput] = useState(""); // Câu hỏi người dùng nhập

  const { data: courseData } = useGetCourses(
    (data) => {
      setListCourses(data?.data || []);
      if (data?.data?.length > 0) setSelectedCourse(data.data[0]._id);
    },
    (error) => api.error({ message: "Không thể tải danh sách khóa học", description: error.message })
  );

  useEffect(() => {
    if (courseData) {
      setListCourses(courseData?.data || []);
      if (courseData?.data?.length > 0) {
        setSelectedCourse(courseData.data[0]._id);
      }
    }
  }, [courseData]);

  const { data: discussionsData, refetch } = useGetDiscussionsByCourse(selectedCourse);

  const { mutate: createDiscussion } = useCreateDiscussion(() => {
    api.success({ message: "Gửi câu hỏi thành công!" });
    setNewQuestion("");
    refetch();
  });

  const { mutate: addAnswer } = useAddAnswer(() => {
    api.success({ message: "Gửi câu trả lời thành công!" });
    setNewComment({});
    refetch();
  });

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || !selectedCourse) return;

    const course = listCourses.find((c) => c._id === selectedCourse);
    const newDiscussion = {
      courseId: selectedCourse,
      courseName: course?.title || "Unknown Course",
      userId,
      question: newQuestion,
      answers: [],
      isClose: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createDiscussion(newDiscussion, {
      onSuccess: (data) => {
        setDiscussions([...discussions, { ...newDiscussion, _id: data._id }]);
        setNewQuestion("");
        api.success({ message: "Gửi câu hỏi thành công!" });
      },
      onError: (error) => {
        api.error({
          message: "Lỗi khi gửi câu hỏi",
          description: error.message,
        });
      },
    });
  };

  const handleAddComment = (id) => {
    if (!newComment[id]) return;
    addAnswer({ id, payload: { userId: getUserIdFromToken(), answer: newComment[id] } });
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      return payload?._id;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  // Hàm gửi câu hỏi đến backend (backend sẽ gọi Gemini API)
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    // Thêm câu hỏi của người dùng vào danh sách tin nhắn
    const userMessage = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput(""); // Xóa ô nhập liệu

    try {
      // Gọi endpoint trên backend
      const response = await axios.post("http://localhost:4000/api/v1/gemini", {
        message: chatInput,
      });

      // Lấy câu trả lời từ backend
      const aiMessage = {
        role: "ai",
        content: response.data.content || "Không nhận được câu trả lời từ AI.",
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      api.error({
        message: "Lỗi khi gửi câu hỏi đến AI",
        description: error.message,
      });
      const errorMessage = { role: "ai", content: "Có lỗi xảy ra, vui lòng thử lại!" };
      setChatMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div style={{ display: "flex", maxWidth: 1200, margin: "20px auto", gap: "20px" }}>
      {contextHolder}
      {/* Phần thảo luận khóa học (giữ nguyên) */}
      <div style={{ flex: 2 }}>
        <Card title="Đặt câu hỏi thảo luận cho khoá học">
          <Select value={selectedCourse} onChange={setSelectedCourse} style={{ width: "100%", marginBottom: 10 }}>
            {listCourses.map((course) => (
              <Option key={course._id} value={course._id}>
                {course.title}
              </Option>
            ))}
          </Select>
          <TextArea rows={2} placeholder="Nhập câu hỏi của bạn..." value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
          <Button type="primary" onClick={handleAddQuestion} style={{ marginTop: 8 }}>
            Gửi câu hỏi
          </Button>
        </Card>

        {listCourses.map((course) => (
          <Card key={course._id} title={course.title} style={{ marginTop: 20 }}>
            <List
              dataSource={(discussionsData || []).filter((d) => d.courseId._id === course._id)}
              renderItem={(item) => (
                <Card style={{ marginBottom: 16 }}>
                  <p>
                    <Avatar icon={<UserOutlined />} /> <b>{item.userId?.fullName}</b> hỏi:
                  </p>
                  <p>{item.question}</p>
                  <List
                    dataSource={item.answers}
                    renderItem={(answer) => (
                      <Card.Grid style={{ width: "100%" }}>
                        <p>
                          <b>{answer.userId?.fullName}:</b> {answer.answer}
                        </p>
                      </Card.Grid>
                    )}
                  />
                  {!item.isClose ? (
                    <>
                      <TextArea
                        rows={2}
                        placeholder="Nhập câu trả lời..."
                        value={newComment[item._id] || ""}
                        onChange={(e) => setNewComment({ ...newComment, [item._id]: e.target.value })}
                      />
                      <Button type="primary" onClick={() => handleAddComment(item._id)} style={{ marginTop: 8 }}>
                        Gửi
                      </Button>
                    </>
                  ) : (
                    <Tag color="red">
                      <LockOutlined /> Đã đóng
                    </Tag>
                  )}
                </Card>
              )}
            />
          </Card>
        ))}
      </div>

      {/* Phần chat với Google Gemini API (gọi qua backend) */}
      <div style={{ flex: 1, maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <Card title="Chat với AI (Google Gemini)" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Danh sách tin nhắn */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              borderBottom: "1px solid #e8e8e8",
              marginBottom: "10px",
            }}
          >
            {chatMessages.length === 0 ? (
              <p style={{ textAlign: "center", color: "#888" }}>
                Hỏi tôi bất cứ điều gì! Tôi là AI được cung cấp bởi Google Gemini. 🚀
              </p>
            ) : (
              chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "10px",
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      background: msg.role === "user" ? "#1890ff" : "#f0f0f0",
                      color: msg.role === "user" ? "#fff" : "#000",
                      maxWidth: "80%",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ô nhập liệu và nút gửi */}
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Hỏi AI một câu hỏi..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onPressEnter={handleSendChatMessage}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSendChatMessage}>
              Gửi
            </Button>
          </Space.Compact>
        </Card>
      </div>
    </div>
  );
};

export default Disscusion;
