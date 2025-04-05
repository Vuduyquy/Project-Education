// import { ClockCircleOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Col,
//   Divider,
//   Form,
//   Input,
//   Modal,
//   notification,
//   Radio,
//   Row,
//   Select,
//   Space,
// } from "antd";
// import React, { useState, useEffect, apiMessage } from "react";
// import { useNavigate } from "react-router-dom";
// import "./styles.css";
// import { useCreateExam } from "../../../../apis/createExam.api";
// import { useCreateCategory, useGetCategory } from "../../../../apis/categories.api";
// import openNotification from "../../../../config/notification";

// const CreateExam = () => {
//   const navigate = useNavigate();
//   const [api, contextHolder] = notification.useNotification();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [listCategory, setListCategory] = useState([]);
//   const [title, setTitle] = useState(null);
//   const [description, setDescription] = useState(null);
//   const [duration, setDuration] = useState(0);
//   const [level, setLevel] = useState(1);
//   const [questions, setQuestions] = useState([
//     {
//       questionText: null,
//       answers: ["", "", "", ""],
//       correctAnswer: null,
//     },
//   ]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [form] = Form.useForm();

//   const handleChangeTitle = (event) => {
//     setTitle(event.target.value);
//   };
//   const handleChangeDecription = (event) => {
//     setDescription(event.target.value);
//   };

//   const handleChangeTime = (event) => {
//     const value = parseInt(event.target.value, 10); // Chuyển đổi chuỗi sang số
//     setDuration(value > 0 ? value : 0);
//   };

//   const { data: categoryData, isLoading: isLoadingCategory } = useGetCategory(
//     (data) => {
//       console.log("Category Data:", data);
//       setListCategory(data.data); // Đảm bảo cập nhật đúng dữ liệu
//     },
//     (error) => {
//       api.error({
//         message: "Không thể tải danh mục",
//         description: error.message,
//       });
//     }
//   );

//   // Cập nhật danh mục khi `categoryData` thay đổi
//   useEffect(() => {
//     if (categoryData) {
//       console.log("Updating listCategory with:", categoryData.data?.data);
//       setListCategory(categoryData?.data?.data);
//     }
//   }, [categoryData]);

//   const handleChangeSubject = (value) => {
//     console.log("Selected subject:", value);
//     setSelectedCategory(value);
//   };

//   const handleCloseForm = () => {
//     navigate("/admin"); // Điều hướng về trang danh sách đề thi
//   };

//   const handleChangeLevel = (value) => {
//     setLevel(value);
//   };

//   const handleAddQuestion = () => {
//     const newQuestion = {
//       questionText: null,
//       answers: ["", "", "", ""],
//       correctAnswer: null,
//     };

//     setQuestions([...questions, newQuestion]);
//   };

//   // Hàm xử lý nội dung câu hỏi
//   const handleChangeQuestion = (event, index) => {
//     const questionsTemp = [...questions];
//     questionsTemp[index].questionText = event.target.value;

//     setQuestions(questionsTemp);
//   };

//   // Hàm xử lý đáp án
//   const handleChangeAnswer = (event, index, indexAswer) => {
//     const questionsTemp = [...questions];
//     questionsTemp[index].answers[indexAswer] = event.target.value;

//     setQuestions(questionsTemp);
//   };

//   // Hàm chọn đáp án đúng
//   const handleChangeAnswerCorrect = (event, index) => {
//     const questionsTemp = [...questions];
//     questionsTemp[index].correctAnswer = event.target.value;

//     setQuestions(questionsTemp);
//   };

//   const { mutate: createExams } = useCreateExam();

//   const handleCreateExam = async () => {
//     setIsLoading(true);
//     const newExams = {
//       title,
//       description,
//       duration: Number(duration),
//       category: selectedCategory,
//       level,
//       questions,
//     };
//     console.log("Data being sent to API:", newExams); // Kiểm tra dữ liệu trước khi gửi

//     try {
//       await createExams(newExams, {
//         onSuccess: (data) => {
//           console.log("Response from server:", data);
//           api.success({ message: "Tạo đề thi thành công" });
//           resetForm();
//         },
//         onError: (error) => {
//           console.error("Error response from server:", error.response?.data);
//           api.error({
//             message: "Tạo đề thi không thành công",
//             description: error.message,
//           });
//         },
//       });
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const checkStatusDisabledButtonCreate = () => {
//     if (
//       !title ||
//       !duration ||
//       !selectedCategory ||
//       !level ||
//       questions.length < 2
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   const resetForm = () => {
//     setTitle(null);
//     setSelectedCategory();
//     setDescription(null);
//     setDuration(0);
//     setLevel(1);
//     setQuestions([
//       {
//         questionText: null,
//         answers: ["", "", "", ""],
//         correctAnswer: null,
//       },
//     ]);
//   };

//   const { mutate: createCategory } = useCreateCategory();

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         console.log("Submitted Data:", values);
  
//         createCategory(values, {
//           onSuccess: (data) => {
//             console.log("Response from server:", data);
//             api.success({ message: "Tạo môn thi thành công" });
  
//             // Cập nhật danh sách môn thi sau khi tạo
//             setListCategory((prev) => [...prev, data.data]);
  
//             setIsModalOpen(false);
//             form.resetFields(); // Reset form after submitting
//           },
//           onError: (error) => {
//             console.error("Error response from server:", error.response?.data);
//             api.error({
//               message: "Tạo môn thi không thành công",
//               description: error.message,
//             });
//           },
//         });
//       })
//       .catch((info) => {
//         console.log("Validate Failed:", info);
//       });
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     form.resetFields();
//   };

//   return (
//     <div className="create-exam">
//       {contextHolder}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <h1>Tạo đề thi</h1>
//       </div>

//       <Form name="basic" layout="vertical">
//         <Row justify="space-between">
//           <Col span={12}>
//             <div>
//               <Divider orientation="left">Nội dung đề thi</Divider>
//             </div>
//             <Row justify="space-between">
//               <Col span={12} style={{ padding: "0px 12px" }}>
//                 <Form.Item label="Tên đề thi">
//                   <Input
//                     size="large"
//                     value={title}
//                     onChange={handleChangeTitle}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12} style={{ padding: "0px 12px" }}>
//                 <Form.Item label="Mô tả đề thi">
//                   <Input
//                     size="large"
//                     value={description}
//                     onChange={handleChangeDecription}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12} style={{ padding: "0px 12px" }}>
//                 <Form.Item label="Thời gian">
//                   <Input
//                     prefix={<ClockCircleOutlined />}
//                     suffix="phút"
//                     type="number"
//                     min={1}
//                     size="large"
//                     value={duration}
//                     onChange={handleChangeTime}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12} style={{ padding: "0px 12px" }}>
//                 <Form.Item label="Môn thi">
//                   <Select
//                     size="large"
//                     placeholder="Chọn môn thi"
//                     value={selectedCategory}
//                     onChange={handleChangeSubject}
//                     loading={isLoadingCategory}
//                   >
//                     {listCategory?.map((category) => (
//                       <Select.Option key={category._id} value={category._id}>
//                         {category.title}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//                 <Button
//                   type="primary"
//                   style={{
//                     marginRight: "12px",
//                   }}
//                   onClick={showModal}
//                 >
//                   Tạo môn thi
//                 </Button>
//               </Col>
//               <Col span={12} style={{ padding: "0px 12px" }}>
//                 <Form.Item label="Mức độ">
//                   <Select
//                     size="large"
//                     value={level}
//                     onChange={handleChangeLevel}
//                     options={[
//                       {
//                         value: 1,
//                         label: "Cơ bản",
//                       },
//                       {
//                         value: 2,
//                         label: "Trung bình",
//                       },
//                       {
//                         value: 3,
//                         label: "Nâng cao",
//                       },
//                     ]}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Col>
//           <Col span={11}>
//             <div>
//               <Divider orientation="left">Số lượng câu hỏi</Divider>
//             </div>
//             <Row justify="space-between">
//               <Col span={24} style={{ padding: "0px 12px" }}>
//                 {questions.length > 0 && (
//                   <div
//                     style={{
//                       maxHeight: "400px", // Giới hạn chiều cao tối đa
//                       overflowY: "auto", // Kích hoạt cuộn dọc
//                     }}
//                   >
//                     {questions?.map((question, index) => (
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           marginTop: index === 0 ? "0px" : "20px",
//                         }}
//                       >
//                         <Form.Item label={`Câu hỏi ${index + 1}`}>
//                           <Input.TextArea
//                             value={question.questionText || ""}
//                             onChange={(event) =>
//                               handleChangeQuestion(event, index)
//                             }
//                           />
//                         </Form.Item>
//                         <Radio.Group
//                           value={question.correctAnswer || ""}
//                           onChange={(event) =>
//                             handleChangeAnswerCorrect(event, index)
//                           }
//                         >
//                           <Space direction="vertical" style={{ width: "100%" }}>
//                             <Radio value="A">
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <div
//                                   style={{ marginRight: "8px", width: "78px" }}
//                                 >
//                                   Đáp án A
//                                 </div>
//                                 <Input
//                                   value={question.answers[(index, 0)] || []}
//                                   onChange={(event) =>
//                                     handleChangeAnswer(event, index, 0)
//                                   }
//                                 />
//                               </div>
//                             </Radio>
//                             <Radio value="B">
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <div
//                                   style={{ marginRight: "8px", width: "78px" }}
//                                 >
//                                   Đáp án B
//                                 </div>
//                                 <Input
//                                   value={question.answers[(index, 1)] || []}
//                                   onChange={(event) =>
//                                     handleChangeAnswer(event, index, 1)
//                                   }
//                                 />
//                               </div>
//                             </Radio>
//                             <Radio value="C">
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <div
//                                   style={{ marginRight: "8px", width: "78px" }}
//                                 >
//                                   Đáp án C
//                                 </div>
//                                 <Input
//                                   value={question.answers[(index, 2)] || []}
//                                   onChange={(event) =>
//                                     handleChangeAnswer(event, index, 2)
//                                   }
//                                 />
//                               </div>
//                             </Radio>
//                             <Radio value="D">
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <div
//                                   style={{ marginRight: "8px", width: "78px" }}
//                                 >
//                                   Đáp án D
//                                 </div>
//                                 <Input
//                                   value={question.answers[(index, 3)] || []}
//                                   onChange={(event) =>
//                                     handleChangeAnswer(event, index, 3)
//                                   }
//                                 />
//                               </div>
//                             </Radio>
//                           </Space>
//                         </Radio.Group>
//                       </div>
//                     ))}

//                     <Button
//                       fullWidth
//                       style={{ marginTop: "12px" }}
//                       onClick={handleAddQuestion}
//                     >
//                       Thêm mới câu hỏi
//                     </Button>
//                   </div>
//                 )}
//               </Col>
//             </Row>
//           </Col>
//         </Row>

//         <div
//           style={{
//             marginTop: "32px",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <Button
//             danger
//             style={{ marginLeft: "12px" }}
//             onClick={handleCloseForm}
//           >
//             Đóng lại
//           </Button>
//           <Button
//             type="primary"
//             style={{ marginRight: "12px" }}
//             onClick={handleCreateExam}
//             loading={isLoading}
//             disabled={checkStatusDisabledButtonCreate()}
//           >
//             Tạo đề thi
//           </Button>
//         </div>
//       </Form>
//       <Modal
//         title="Tạo Môn Thi"
//         open={isModalOpen}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         okText="Tạo"
//         cancelText="Hủy"
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Tiêu đề"
//             name="title"
//             rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
//           >
//             <Input placeholder="Nhập tiêu đề môn thi" />
//           </Form.Item>
//           <Form.Item
//             label="Mô tả"
//             name="description"
//             rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
//           >
//             <Input.TextArea rows={3} placeholder="Nhập mô tả môn thi" />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default CreateExam;


import { ClockCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Checkbox,
  Space,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { useCreateExam } from "../../../../apis/createExam.api";
import { useCreateCategory, useGetCategory } from "../../../../apis/categories.api";
import { useGetQuestions, useUpdateQuestion } from "../../../../apis/question.api"; // Thêm useUpdateQuestion

const { Text } = Typography;

const CreateExam = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [listCategory, setListCategory] = useState([]);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [duration, setDuration] = useState(0);
  const [level, setLevel] = useState(1);
  const [selectedMultipleChoiceQuestions, setSelectedMultipleChoiceQuestions] = useState([]);
  const [selectedEssayQuestions, setSelectedEssayQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultipleChoiceModalOpen, setIsMultipleChoiceModalOpen] = useState(false);
  const [isEssayModalOpen, setIsEssayModalOpen] = useState(false);
  const [tempSelectedMultipleChoiceIds, setTempSelectedMultipleChoiceIds] = useState([]);
  const [tempSelectedEssayIds, setTempSelectedEssayIds] = useState([]);
  const [form] = Form.useForm();

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleChangeTime = (event) => {
    const value = parseInt(event.target.value, 10);
    setDuration(value > 0 ? value : 0);
  };

  const { data: categoryData, isLoading: isLoadingCategory } = useGetCategory(
    (data) => {
      setListCategory(data.data);
    },
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (categoryData) {
      setListCategory(categoryData.data?.data || []);
    }
  }, [categoryData]);

  // Lấy danh sách câu hỏi từ API
  const { data: questionsData, isLoading: isLoadingQuestions } = useGetQuestions(
    (data) => {
      console.log("Questions Data:", data);
    },
    (error) => {
      api.error({
        message: "Không thể tải danh sách câu hỏi",
        description: error.message,
      });
    }
  );

  const handleChangeSubject = (value) => {
    setSelectedCategory(value);
  };

  const handleCloseForm = () => {
    navigate("/admin");
  };

  const handleChangeLevel = (value) => {
    setLevel(value);
  };

  // Mở modal chọn câu hỏi trắc nghiệm
  const showMultipleChoiceModal = () => {
    setTempSelectedMultipleChoiceIds(selectedMultipleChoiceQuestions.map((q) => q._id));
    setIsMultipleChoiceModalOpen(true);
  };

  // Mở modal chọn câu hỏi tự luận
  const showEssayModal = () => {
    setTempSelectedEssayIds(selectedEssayQuestions.map((q) => q._id));
    setIsEssayModalOpen(true);
  };

  // Xử lý khi nhấn "Thêm" trong modal câu hỏi trắc nghiệm
  const handleAddMultipleChoiceQuestions = () => {
    const selected = questionsData?.data?.filter((question) =>
      tempSelectedMultipleChoiceIds.includes(question._id)
    ) || [];
    setSelectedMultipleChoiceQuestions(selected);
    setIsMultipleChoiceModalOpen(false);
  };

  // Xử lý khi nhấn "Thêm" trong modal câu hỏi tự luận
  const handleAddEssayQuestions = () => {
    const selected = questionsData?.data?.filter((question) =>
      tempSelectedEssayIds.includes(question._id)
    ) || [];
    setSelectedEssayQuestions(selected);
    setIsEssayModalOpen(false);
  };

  // Xử lý khi chọn/bỏ chọn câu hỏi trắc nghiệm trong modal
  const handleSelectMultipleChoiceQuestion = (questionId) => {
    setTempSelectedMultipleChoiceIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Xử lý khi chọn/bỏ chọn câu hỏi tự luận trong modal
  const handleSelectEssayQuestion = (questionId) => {
    setTempSelectedEssayIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const { mutate: createExams } = useCreateExam();
  const { mutate: updateQuestion } = useUpdateQuestion(); // Hook để cập nhật câu hỏi

  const handleCreateExam = async () => {
    setIsLoading(true);
    const newExams = {
      title,
      description,
      duration: Number(duration),
      category: selectedCategory,
      level,
      questions: [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions].map((q) => q._id),
    };
  
    try {
      await createExams(newExams, {
        onSuccess: async (data) => {
          console.log("Dữ liệu trả về từ createExams:", data);
          const examId = data?.quizz?._id; // Lấy ID của đề thi vừa tạo
  
          if (!examId) {
            throw new Error("Không tìm thấy examId trong dữ liệu trả về");
          }
  
          api.success({ message: "Tạo đề thi thành công" });
  
          // Cập nhật quizId cho các câu hỏi đã chọn
          const allQuestions = [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions];
          console.log('allQuestions:', allQuestions);
          for (const question of allQuestions) {
            if (!question._id) {
              console.error("Không tìm thấy _id cho câu hỏi:", question);
              continue;
            }
  
            const currentQuizIds = Array.isArray(question.quizId) ? question.quizId : [];
            console.log('currentQuizId:', currentQuizIds);
            const updatedQuizIds = [...currentQuizIds, examId]; // Thêm examId vào mảng quizId
  
            await updateQuestion(
              {
                id: question._id,
                payload: { quizId: updatedQuizIds },
              },
              {
                onSuccess: () => {
                  console.log(`Cập nhật quizId cho câu hỏi ${question._id} thành công`);
                },
                onError: (error) => {
                  console.error(`Lỗi khi cập nhật quizId cho câu hỏi ${question._id}:`, error);
                  api.error({
                    message: `Cập nhật quizId cho câu hỏi ${question._id} thất bại`,
                    description: error.message,
                  });
                },
              }
            );
          }
  
          resetForm();
        },
        onError: (error) => {
          console.error("Lỗi khi tạo đề thi:", error);
          api.error({
            message: "Tạo đề thi không thành công",
            description: error.message,
          });
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      api.error({
        message: "Có lỗi xảy ra khi tạo đề thi",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // const handleCreateExam = async () => {
  //   setIsLoading(true);
  //   const newExams = {
  //     title,
  //     description,
  //     duration: Number(duration),
  //     category: selectedCategory,
  //     level,
  //     questions: [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions].map((q) => q._id),
  //   };

  //   try {
  //     await createExams(newExams, {
  //       onSuccess: async (data) => {
  //         console.log("Dữ liệu trả về từ createExams:", data);
  //         const examId = data.quizz._id; // Lấy ID của đề thi vừa tạo
  //         api.success({ message: "Tạo đề thi thành công" });

  //         // Cập nhật quizId cho các câu hỏi đã chọn
  //         const allQuestions = [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions];
  //         console.log('allQuestions:', allQuestions);
  //         for (const question of allQuestions) {
  //           const currentQuizIds = Array.isArray(question.quizId) ? question.quizId : [];
  //           console.log('currentQuizId:', currentQuizIds)
  //           const updatedQuizIds = [...currentQuizIds, examId]; // Thêm examId vào mảng quizId

  //           await updateQuestion(
  //             {
  //               id: question._id,
  //               payload: { quizId: updatedQuizIds },
  //             },
  //             {
  //               onSuccess: () => {
  //                 console.log(`Cập nhật quizId cho câu hỏi ${question._id} thành công`);
  //               },
  //               onError: (error) => {
  //                 api.error({
  //                   message: `Cập nhật quizId cho câu hỏi ${question._id} thất bại`,
  //                   description: error.message,
  //                 });
  //               },
  //             }
  //           );
  //         }

  //         resetForm();
  //       },
  //       onError: (error) => {
  //         api.error({
  //           message: "Tạo đề thi không thành công",
  //           description: error.message,
  //         });
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const checkStatusDisabledButtonCreate = () => {
    return (
      !title ||
      !duration ||
      !selectedCategory ||
      !level ||
      (selectedMultipleChoiceQuestions.length + selectedEssayQuestions.length < 1)
    );
  };

  const resetForm = () => {
    setTitle(null);
    setSelectedCategory(null);
    setDescription(null);
    setDuration(0);
    setLevel(1);
    setSelectedMultipleChoiceQuestions([]);
    setSelectedEssayQuestions([]);
  };

  const { mutate: createCategory } = useCreateCategory();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        createCategory(values, {
          onSuccess: (data) => {
            api.success({ message: "Tạo môn thi thành công" });
            setListCategory((prev) => [...prev, data.data]);
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: (error) => {
            api.error({
              message: "Tạo môn thi không thành công",
              description: error.message,
            });
          },
        });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleMultipleChoiceModalCancel = () => {
    setIsMultipleChoiceModalOpen(false);
    setTempSelectedMultipleChoiceIds([]);
  };

  const handleEssayModalCancel = () => {
    setIsEssayModalOpen(false);
    setTempSelectedEssayIds([]);
  };

  return (
    <div className="create-exam">
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Tạo đề thi</h1>
      </div>

      <Form name="basic" layout="vertical">
        <Row justify="space-between">
          <Col span={12}>
            <div>
              <Divider orientation="left">Nội dung đề thi</Divider>
            </div>
            <Row justify="space-between">
              <Col span={12} style={{ padding: "0px 12px" }}>
                <Form.Item label="Tên đề thi">
                  <Input size="large" value={title} onChange={handleChangeTitle} />
                </Form.Item>
              </Col>
              <Col span={12} style={{ padding: "0px 12px" }}>
                <Form.Item label="Mô tả đề thi">
                  <Input size="large" value={description} onChange={handleChangeDescription} />
                </Form.Item>
              </Col>
              <Col span={12} style={{ padding: "0px 12px" }}>
                <Form.Item label="Thời gian">
                  <Input
                    prefix={<ClockCircleOutlined />}
                    suffix="phút"
                    type="number"
                    min={1}
                    size="large"
                    value={duration}
                    onChange={handleChangeTime}
                  />
                </Form.Item>
              </Col>
              <Col span={12} style={{ padding: "0px 12px" }}>
                <Form.Item label="Môn thi">
                  <Select
                    size="large"
                    placeholder="Chọn môn thi"
                    value={selectedCategory}
                    onChange={handleChangeSubject}
                    loading={isLoadingCategory}
                  >
                    {listCategory?.map((category) => (
                      <Select.Option key={category._id} value={category._id}>
                        {category.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button type="primary" style={{ marginRight: "12px" }} onClick={showModal}>
                  Tạo môn thi
                </Button>
              </Col>
              <Col span={12} style={{ padding: "0px 12px" }}>
                <Form.Item label="Mức độ">
                  <Select
                    size="large"
                    value={level}
                    onChange={handleChangeLevel}
                    options={[
                      { value: 1, label: "Cơ bản" },
                      { value: 2, label: "Trung bình" },
                      { value: 3, label: "Nâng cao" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={11}>
            <div>
              <Divider orientation="left">Chọn câu hỏi</Divider>
            </div>
            <Row justify="space-between">
              <Col span={24} style={{ padding: "0px 12px" }}>
                {/* Phần Trắc nghiệm */}
                <div style={{ marginBottom: "20px" }}>
                  <Text strong>Phần Trắc nghiệm</Text>
                  <div style={{ marginTop: "10px" }}>
                    <Button type="primary" onClick={showMultipleChoiceModal}>
                      Thêm câu hỏi
                    </Button>
                  </div>
                  {selectedMultipleChoiceQuestions.length > 0 && (
                    <div
                      style={{
                        marginTop: "20px",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {selectedMultipleChoiceQuestions.map((question, index) => (
                        <div
                          key={question._id}
                          style={{
                            marginTop: "10px",
                            padding: "10px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                          }}
                        >
                          <Text strong>{`Câu ${index + 1}: `}</Text>
                          <Text>{question.questionText}</Text>
                          <div style={{ marginTop: "5px" }}>
                            {question.answers?.map((answer, answerIndex) => (
                              <div key={answerIndex} style={{ display: "flex", alignItems: "center" }}>
                                <Checkbox disabled style={{ marginRight: "8px" }} />
                                <Text>{`Đáp án ${String.fromCharCode(65 + answerIndex)}: ${answer.answerText}`}</Text>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phần Tự luận */}
                <div>
                  <Text strong>Phần Tự luận</Text>
                  <div style={{ marginTop: "10px" }}>
                    <Button type="primary" onClick={showEssayModal}>
                      Thêm câu hỏi
                    </Button>
                  </div>
                  {selectedEssayQuestions.length > 0 && (
                    <div
                      style={{
                        marginTop: "20px",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {selectedEssayQuestions.map((question, index) => (
                        <div
                          key={question._id}
                          style={{
                            marginTop: "10px",
                            padding: "10px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "4px",
                          }}
                        >
                          <Text strong>{`Câu ${index + 1}: `}</Text>
                          <Text>{question.questionText}</Text>
                          <div style={{ marginTop: "5px" }}>
                            <Text>Loại câu hỏi: Tự luận (Không có đáp án mẫu)</Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button danger style={{ marginLeft: "12px" }} onClick={handleCloseForm}>
            Đóng lại
          </Button>
          <Button
            type="primary"
            style={{ marginRight: "12px" }}
            onClick={handleCreateExam}
            loading={isLoading}
            disabled={checkStatusDisabledButtonCreate()}
          >
            Tạo đề thi
          </Button>
        </div>
      </Form>

      {/* Modal tạo môn thi */}
      <Modal
        title="Tạo Môn Thi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề môn thi" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả môn thi" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chọn câu hỏi trắc nghiệm */}
      <Modal
        title="Chọn câu hỏi trắc nghiệm"
        open={isMultipleChoiceModalOpen}
        onOk={handleAddMultipleChoiceQuestions}
        onCancel={handleMultipleChoiceModalCancel}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {questionsData?.data
            ?.filter((question) => {
              const questionType = Array.isArray(question.questionType) && question.questionType.length > 0 ? question.questionType[0] : undefined;
              return questionType === "single_choice" || questionType === "multiple_choice";
            })
            .map((question) => (
              <div
                key={question._id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #d9d9d9",
                  marginBottom: "10px",
                }}
              >
                <Checkbox
                  checked={tempSelectedMultipleChoiceIds.includes(question._id)}
                  onChange={() => handleSelectMultipleChoiceQuestion(question._id)}
                >
                  <Text strong>{question.questionText}</Text>
                </Checkbox>
                <div style={{ marginLeft: "24px", marginTop: "5px" }}>
                  {question.answers?.map((answer, index) => (
                    <div key={index}>
                      <Text>{`Đáp án ${String.fromCharCode(65 + index)}: ${answer.answerText}`}</Text>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </Modal>

      {/* Modal chọn câu hỏi tự luận */}
      <Modal
        title="Chọn câu hỏi tự luận"
        open={isEssayModalOpen}
        onOk={handleAddEssayQuestions}
        onCancel={handleEssayModalCancel}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {questionsData?.data
            ?.filter((question) => {
              const questionType = Array.isArray(question.questionType) && question.questionType.length > 0 ? question.questionType[0] : undefined;
              return questionType === "essay";
            })
            .map((question) => (
              <div
                key={question._id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #d9d9d9",
                  marginBottom: "10px",
                }}
              >
                <Checkbox
                  checked={tempSelectedEssayIds.includes(question._id)}
                  onChange={() => handleSelectEssayQuestion(question._id)}
                >
                  <Text strong>{question.questionText}</Text>
                </Checkbox>
                <div style={{ marginLeft: "24px", marginTop: "5px" }}>
                  <Text>Loại câu hỏi: Tự luận (Không có đáp án mẫu)</Text>
                </div>
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default CreateExam;