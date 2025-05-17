// import { ClockCircleOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Col,
//   Divider,
//   Form,
//   Input,
//   Modal,
//   notification,
//   Row,
//   Select,
//   Checkbox,
//   Space,
//   Typography,
// } from "antd";
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./styles.css";
// import { useCreateExam } from "../../../../apis/createExam.api";
// import { useCreateCategory, useGetCategory } from "../../../../apis/categories.api";
// import { useGetQuestions, useUpdateQuestion } from "../../../../apis/question.api"; // Thêm useUpdateQuestion

// const { Text } = Typography;

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
//   const [selectedMultipleChoiceQuestions, setSelectedMultipleChoiceQuestions] = useState([]);
//   const [selectedEssayQuestions, setSelectedEssayQuestions] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isMultipleChoiceModalOpen, setIsMultipleChoiceModalOpen] = useState(false);
//   const [isEssayModalOpen, setIsEssayModalOpen] = useState(false);
//   const [tempSelectedMultipleChoiceIds, setTempSelectedMultipleChoiceIds] = useState([]);
//   const [tempSelectedEssayIds, setTempSelectedEssayIds] = useState([]);
//   const [form] = Form.useForm();

//   const handleChangeTitle = (event) => {
//     setTitle(event.target.value);
//   };
//   const handleChangeDescription = (event) => {
//     setDescription(event.target.value);
//   };

//   const handleChangeTime = (event) => {
//     const value = parseInt(event.target.value, 10);
//     setDuration(value > 0 ? value : 0);
//   };

//   const { data: categoryData, isLoading: isLoadingCategory } = useGetCategory(
//     (data) => {
//       setListCategory(data.data);
//     },
//     (error) => {
//       api.error({
//         message: "Không thể tải danh mục",
//         description: error.message,
//       });
//     }
//   );

//   useEffect(() => {
//     if (categoryData) {
//       setListCategory(categoryData.data?.data || []);
//     }
//   }, [categoryData]);

//   // Lấy danh sách câu hỏi từ API
//   const { data: questionsData, isLoading: isLoadingQuestions } = useGetQuestions(
//     (data) => {
//       console.log("Questions Data:", data);
//     },
//     (error) => {
//       api.error({
//         message: "Không thể tải danh sách câu hỏi",
//         description: error.message,
//       });
//     }
//   );

//   const handleChangeSubject = (value) => {
//     setSelectedCategory(value);
//   };

//   const handleCloseForm = () => {
//     navigate("/admin");
//   };

//   const handleChangeLevel = (value) => {
//     setLevel(value);
//   };

//   // Mở modal chọn câu hỏi trắc nghiệm
//   const showMultipleChoiceModal = () => {
//     setTempSelectedMultipleChoiceIds(selectedMultipleChoiceQuestions.map((q) => q._id));
//     setIsMultipleChoiceModalOpen(true);
//   };

//   // Mở modal chọn câu hỏi tự luận
//   const showEssayModal = () => {
//     setTempSelectedEssayIds(selectedEssayQuestions.map((q) => q._id));
//     setIsEssayModalOpen(true);
//   };

//   // Xử lý khi nhấn "Thêm" trong modal câu hỏi trắc nghiệm
//   const handleAddMultipleChoiceQuestions = () => {
//     const selected = questionsData?.data?.filter((question) =>
//       tempSelectedMultipleChoiceIds.includes(question._id)
//     ) || [];
//     setSelectedMultipleChoiceQuestions(selected);
//     setIsMultipleChoiceModalOpen(false);
//   };

//   // Xử lý khi nhấn "Thêm" trong modal câu hỏi tự luận
//   const handleAddEssayQuestions = () => {
//     const selected = questionsData?.data?.filter((question) =>
//       tempSelectedEssayIds.includes(question._id)
//     ) || [];
//     setSelectedEssayQuestions(selected);
//     setIsEssayModalOpen(false);
//   };

//   // Xử lý khi chọn/bỏ chọn câu hỏi trắc nghiệm trong modal
//   const handleSelectMultipleChoiceQuestion = (questionId) => {
//     setTempSelectedMultipleChoiceIds((prev) =>
//       prev.includes(questionId)
//         ? prev.filter((id) => id !== questionId)
//         : [...prev, questionId]
//     );
//   };

//   // Xử lý khi chọn/bỏ chọn câu hỏi tự luận trong modal
//   const handleSelectEssayQuestion = (questionId) => {
//     setTempSelectedEssayIds((prev) =>
//       prev.includes(questionId)
//         ? prev.filter((id) => id !== questionId)
//         : [...prev, questionId]
//     );
//   };

//   const { mutate: createExams } = useCreateExam();
//   const { mutate: updateQuestion } = useUpdateQuestion(); // Hook để cập nhật câu hỏi

//   const handleCreateExam = async () => {
//     setIsLoading(true);
//     const newExams = {
//       title,
//       description,
//       duration: Number(duration),
//       category: selectedCategory,
//       level,
//       questions: [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions].map((q) => q._id),
//     };

//     try {
//       await createExams(newExams, {
//         onSuccess: async (data) => {
//           console.log("Dữ liệu trả về từ createExams:", data);
//           const examId = data?.quizz?._id; // Lấy ID của đề thi vừa tạo

//           if (!examId) {
//             throw new Error("Không tìm thấy examId trong dữ liệu trả về");
//           }

//           api.success({ message: "Tạo đề thi thành công" });

//           // Cập nhật quizId cho các câu hỏi đã chọn
//           const allQuestions = [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions];
//           console.log('allQuestions:', allQuestions);
//           for (const question of allQuestions) {
//             if (!question._id) {
//               console.error("Không tìm thấy _id cho câu hỏi:", question);
//               continue;
//             }

//             const currentQuizIds = Array.isArray(question.quizId) ? question.quizId : [];
//             console.log('currentQuizId:', currentQuizIds);
//             const updatedQuizIds = [...currentQuizIds, examId]; // Thêm examId vào mảng quizId

//             await updateQuestion(
//               {
//                 id: question._id,
//                 payload: { quizId: updatedQuizIds },
//               },
//               {
//                 onSuccess: () => {
//                   console.log(`Cập nhật quizId cho câu hỏi ${question._id} thành công`);
//                 },
//                 onError: (error) => {
//                   console.error(`Lỗi khi cập nhật quizId cho câu hỏi ${question._id}:`, error);
//                   api.error({
//                     message: `Cập nhật quizId cho câu hỏi ${question._id} thất bại`,
//                     description: error.message,
//                   });
//                 },
//               }
//             );
//           }

//           resetForm();
//         },
//         onError: (error) => {
//           console.error("Lỗi khi tạo đề thi:", error);
//           api.error({
//             message: "Tạo đề thi không thành công",
//             description: error.message,
//           });
//         },
//       });
//     } catch (error) {
//       console.error("Unexpected error:", error);
//       api.error({
//         message: "Có lỗi xảy ra khi tạo đề thi",
//         description: error.message,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const handleCreateExam = async () => {
//   //   setIsLoading(true);
//   //   const newExams = {
//   //     title,
//   //     description,
//   //     duration: Number(duration),
//   //     category: selectedCategory,
//   //     level,
//   //     questions: [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions].map((q) => q._id),
//   //   };

//   //   try {
//   //     await createExams(newExams, {
//   //       onSuccess: async (data) => {
//   //         console.log("Dữ liệu trả về từ createExams:", data);
//   //         const examId = data.quizz._id; // Lấy ID của đề thi vừa tạo
//   //         api.success({ message: "Tạo đề thi thành công" });

//   //         // Cập nhật quizId cho các câu hỏi đã chọn
//   //         const allQuestions = [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions];
//   //         console.log('allQuestions:', allQuestions);
//   //         for (const question of allQuestions) {
//   //           const currentQuizIds = Array.isArray(question.quizId) ? question.quizId : [];
//   //           console.log('currentQuizId:', currentQuizIds)
//   //           const updatedQuizIds = [...currentQuizIds, examId]; // Thêm examId vào mảng quizId

//   //           await updateQuestion(
//   //             {
//   //               id: question._id,
//   //               payload: { quizId: updatedQuizIds },
//   //             },
//   //             {
//   //               onSuccess: () => {
//   //                 console.log(`Cập nhật quizId cho câu hỏi ${question._id} thành công`);
//   //               },
//   //               onError: (error) => {
//   //                 api.error({
//   //                   message: `Cập nhật quizId cho câu hỏi ${question._id} thất bại`,
//   //                   description: error.message,
//   //                 });
//   //               },
//   //             }
//   //           );
//   //         }

//   //         resetForm();
//   //       },
//   //       onError: (error) => {
//   //         api.error({
//   //           message: "Tạo đề thi không thành công",
//   //           description: error.message,
//   //         });
//   //       },
//   //     });
//   //   } catch (error) {
//   //     console.error("Unexpected error:", error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const checkStatusDisabledButtonCreate = () => {
//     return (
//       !title ||
//       !duration ||
//       !selectedCategory ||
//       !level ||
//       (selectedMultipleChoiceQuestions.length + selectedEssayQuestions.length < 1)
//     );
//   };

//   const resetForm = () => {
//     setTitle(null);
//     setSelectedCategory(null);
//     setDescription(null);
//     setDuration(0);
//     setLevel(1);
//     setSelectedMultipleChoiceQuestions([]);
//     setSelectedEssayQuestions([]);
//   };

//   const { mutate: createCategory } = useCreateCategory();

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     form
//       .validateFields()
//       .then((values) => {
//         createCategory(values, {
//           onSuccess: (data) => {
//             api.success({ message: "Tạo môn thi thành công" });
//             setListCategory((prev) => [...prev, data.data]);
//             setIsModalOpen(false);
//             form.resetFields();
//           },
//           onError: (error) => {
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

//   const handleMultipleChoiceModalCancel = () => {
//     setIsMultipleChoiceModalOpen(false);
//     setTempSelectedMultipleChoiceIds([]);
//   };

//   const handleEssayModalCancel = () => {
//     setIsEssayModalOpen(false);
//     setTempSelectedEssayIds([]);
//   };

//   return (
//     <div className="create-exam">
//       {contextHolder}
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
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
//                   <Input size="large" value={title} onChange={handleChangeTitle} />
//                 </Form.Item>
//               </Col>
//               <Col span={12} style={{ padding: "0px 12px" }}>
//                 <Form.Item label="Mô tả đề thi">
//                   <Input size="large" value={description} onChange={handleChangeDescription} />
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
//                 <Button type="primary" style={{ marginRight: "12px" }} onClick={showModal}>
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
//                       { value: 1, label: "Cơ bản" },
//                       { value: 2, label: "Trung bình" },
//                       { value: 3, label: "Nâng cao" },
//                     ]}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Col>
//           <Col span={11}>
//             <div>
//               <Divider orientation="left">Chọn câu hỏi</Divider>
//             </div>
//             <Row justify="space-between">
//               <Col span={24} style={{ padding: "0px 12px" }}>
//                 {/* Phần Trắc nghiệm */}
//                 <div style={{ marginBottom: "20px" }}>
//                   <Text strong>Phần Trắc nghiệm</Text>
//                   <div style={{ marginTop: "10px" }}>
//                     <Button type="primary" onClick={showMultipleChoiceModal}>
//                       Thêm câu hỏi
//                     </Button>
//                   </div>
//                   {selectedMultipleChoiceQuestions.length > 0 && (
//                     <div
//                       style={{
//                         marginTop: "20px",
//                         maxHeight: "200px",
//                         overflowY: "auto",
//                       }}
//                     >
//                       {selectedMultipleChoiceQuestions.map((question, index) => (
//                         <div
//                           key={question._id}
//                           style={{
//                             marginTop: "10px",
//                             padding: "10px",
//                             border: "1px solid #d9d9d9",
//                             borderRadius: "4px",
//                           }}
//                         >
//                           <Text strong>{`Câu ${index + 1}: `}</Text>
//                           <Text>{question.questionText}</Text>
//                           <div style={{ marginTop: "5px" }}>
//                             {question.answers?.map((answer, answerIndex) => (
//                               <div key={answerIndex} style={{ display: "flex", alignItems: "center" }}>
//                                 <Checkbox disabled style={{ marginRight: "8px" }} />
//                                 <Text>{`Đáp án ${String.fromCharCode(65 + answerIndex)}: ${answer.answerText}`}</Text>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Phần Tự luận */}
//                 <div>
//                   <Text strong>Phần Tự luận</Text>
//                   <div style={{ marginTop: "10px" }}>
//                     <Button type="primary" onClick={showEssayModal}>
//                       Thêm câu hỏi
//                     </Button>
//                   </div>
//                   {selectedEssayQuestions.length > 0 && (
//                     <div
//                       style={{
//                         marginTop: "20px",
//                         maxHeight: "200px",
//                         overflowY: "auto",
//                       }}
//                     >
//                       {selectedEssayQuestions.map((question, index) => (
//                         <div
//                           key={question._id}
//                           style={{
//                             marginTop: "10px",
//                             padding: "10px",
//                             border: "1px solid #d9d9d9",
//                             borderRadius: "4px",
//                           }}
//                         >
//                           <Text strong>{`Câu ${index + 1}: `}</Text>
//                           <Text>{question.questionText}</Text>
//                           <div style={{ marginTop: "5px" }}>
//                             <Text>Loại câu hỏi: Tự luận (Không có đáp án mẫu)</Text>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
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
//           <Button danger style={{ marginLeft: "12px" }} onClick={handleCloseForm}>
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

//       {/* Modal tạo môn thi */}
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

//       {/* Modal chọn câu hỏi trắc nghiệm */}
//       <Modal
//         title="Chọn câu hỏi trắc nghiệm"
//         open={isMultipleChoiceModalOpen}
//         onOk={handleAddMultipleChoiceQuestions}
//         onCancel={handleMultipleChoiceModalCancel}
//         okText="Thêm"
//         cancelText="Hủy"
//         width={800}
//       >
//         <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//           {questionsData?.data
//             ?.filter((question) => {
//               const questionType = Array.isArray(question.questionType) && question.questionType.length > 0 ? question.questionType[0] : undefined;
//               return questionType === "single_choice" || questionType === "multiple_choice";
//             })
//             .map((question) => (
//               <div
//                 key={question._id}
//                 style={{
//                   padding: "10px",
//                   borderBottom: "1px solid #d9d9d9",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <Checkbox
//                   checked={tempSelectedMultipleChoiceIds.includes(question._id)}
//                   onChange={() => handleSelectMultipleChoiceQuestion(question._id)}
//                 >
//                   <Text strong>{question.questionText}</Text>
//                 </Checkbox>
//                 <div style={{ marginLeft: "24px", marginTop: "5px" }}>
//                   {question.answers?.map((answer, index) => (
//                     <div key={index}>
//                       <Text>{`Đáp án ${String.fromCharCode(65 + index)}: ${answer.answerText}`}</Text>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//         </div>
//       </Modal>

//       {/* Modal chọn câu hỏi tự luận */}
//       <Modal
//         title="Chọn câu hỏi tự luận"
//         open={isEssayModalOpen}
//         onOk={handleAddEssayQuestions}
//         onCancel={handleEssayModalCancel}
//         okText="Thêm"
//         cancelText="Hủy"
//         width={800}
//       >
//         <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//           {questionsData?.data
//             ?.filter((question) => {
//               const questionType = Array.isArray(question.questionType) && question.questionType.length > 0 ? question.questionType[0] : undefined;
//               return questionType === "essay";
//             })
//             .map((question) => (
//               <div
//                 key={question._id}
//                 style={{
//                   padding: "10px",
//                   borderBottom: "1px solid #d9d9d9",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <Checkbox
//                   checked={tempSelectedEssayIds.includes(question._id)}
//                   onChange={() => handleSelectEssayQuestion(question._id)}
//                 >
//                   <Text strong>{question.questionText}</Text>
//                 </Checkbox>
//                 <div style={{ marginLeft: "24px", marginTop: "5px" }}>
//                   <Text>Loại câu hỏi: Tự luận (Không có đáp án mẫu)</Text>
//                 </div>
//               </div>
//             ))}
//         </div>
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
  Tag,
} from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { useCreateExam } from "../../../../apis/createExam.api";
import {
  useCreateCategory,
  useGetCategory,
} from "../../../../apis/categories.api";
import {
  useGetQuestions,
  useUpdateQuestion,
} from "../../../../apis/question.api";

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
  const [multipleChoiceSelectionOrder, setMultipleChoiceSelectionOrder] = useState([]); // Lưu thứ tự chọn trắc nghiệm
  const [essaySelectionOrder, setEssaySelectionOrder] = useState([]); // Lưu thứ tự chọn tự luận
  const [form] = Form.useForm();

  const handleChangeTitle = (event) => setTitle(event.target.value);
  const handleChangeDescription = (event) => setDescription(event.target.value);

  const handleChangeTime = (event) => {
    const value = parseInt(event.target.value, 10);
    setDuration(value > 0 ? value : 0);
  };

  const { data: categoryData, isLoading: isLoadingCategory, refetch: refetchCategories } = useGetCategory(
    (data) => setListCategory(data.data),
    (error) =>
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      })
  );

  useEffect(() => {
    if (categoryData) {
      setListCategory(categoryData.data?.data || []);
    }
  }, [categoryData]);

  const { data: questionsData, isLoading: isLoadingQuestions } =
    useGetQuestions(
      (data) => console.log("Questions Data:", data),
      (error) =>
        api.error({
          message: "Không thể tải danh sách câu hỏi",
          description: error.message,
        })
    );

  const handleChangeSubject = (value) => setSelectedCategory(value);

  const handleCloseForm = () => navigate("/admin");

  const handleChangeLevel = (value) => setLevel(value);

  const showMultipleChoiceModal = () => {
    setTempSelectedMultipleChoiceIds(
      selectedMultipleChoiceQuestions.map((q) => q._id)
    );
    setIsMultipleChoiceModalOpen(true);
  };

  const showEssayModal = () => {
    setTempSelectedEssayIds(selectedEssayQuestions.map((q) => q._id));
    setIsEssayModalOpen(true);
  };

  const handleAddMultipleChoiceQuestions = () => {
    const selected =
      questionsData?.data?.filter((question) =>
        tempSelectedMultipleChoiceIds.includes(question._id)
      ) || [];
    // Sắp xếp theo thứ tự chọn
    const orderedSelected = tempSelectedMultipleChoiceIds
      .map((id) => selected.find((q) => q._id === id))
      .filter((q) => q); // Loại bỏ undefined
    setSelectedMultipleChoiceQuestions(orderedSelected);
    setIsMultipleChoiceModalOpen(false);
  };

  const handleAddEssayQuestions = () => {
    const selected =
      questionsData?.data?.filter((question) =>
        tempSelectedEssayIds.includes(question._id)
      ) || [];
    // Sắp xếp theo thứ tự chọn
    const orderedSelected = tempSelectedEssayIds
      .map((id) => selected.find((q) => q._id === id))
      .filter((q) => q); // Loại bỏ undefined
    setSelectedEssayQuestions(orderedSelected);
    setIsEssayModalOpen(false);
  };

  const handleSelectMultipleChoiceQuestion = (questionId) => {
    setTempSelectedMultipleChoiceIds((prev) => {
      const newIds = prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId];
      // Cập nhật thứ tự chọn với timestamp
      const currentTime = Date.now();
      setMultipleChoiceSelectionOrder((prevOrder) => {
        const updatedOrder = prevOrder.filter((item) => item.id !== questionId);
        if (!prev.includes(questionId)) {
          updatedOrder.push({ id: questionId, time: currentTime });
        }
        return updatedOrder;
      });
      return newIds;
    });
  };

  const handleSelectEssayQuestion = (questionId) => {
    setTempSelectedEssayIds((prev) => {
      const newIds = prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId];
      // Cập nhật thứ tự chọn với timestamp
      const currentTime = Date.now();
      setEssaySelectionOrder((prevOrder) => {
        const updatedOrder = prevOrder.filter((item) => item.id !== questionId);
        if (!prev.includes(questionId)) {
          updatedOrder.push({ id: questionId, time: currentTime });
        }
        return updatedOrder;
      });
      return newIds;
    });
  };

  const { mutate: createExams } = useCreateExam();
  const { mutate: updateQuestion } = useUpdateQuestion();

  const handleCreateExam = async () => {
    setIsLoading(true);
    const newExams = {
      title,
      description,
      duration: Number(duration),
      category: selectedCategory,
      level,
      questions: [
        ...selectedMultipleChoiceQuestions,
        ...selectedEssayQuestions,
      ].map((q) => q._id),
    };

    try {
      await createExams(newExams, {
        onSuccess: async (data) => {
          //console.log("Dữ liệu trả về từ createExams:", data);
          const examId = data?.data?._id;
          //console.log("examId:", examId);

          if (!examId) {
            throw new Error("Không tìm thấy examId trong dữ liệu trả về");
          }

          api.success({ message: "Tạo đề thi thành công" });

          const allQuestions = [
            ...selectedMultipleChoiceQuestions,
            ...selectedEssayQuestions,
          ];
          for (const question of allQuestions) {
            if (!question._id) {
              console.error("Không tìm thấy _id cho câu hỏi:", question);
              continue;
            }

            const currentQuizIds = Array.isArray(question.quizId)
              ? question.quizId
              : [];
            const updatedQuizIds = [...currentQuizIds, examId];

            await updateQuestion(
              {
                id: question._id,
                payload: { quizId: updatedQuizIds },
              },
              {
                onSuccess: () => {
                  console.log(
                    `Cập nhật quizId cho câu hỏi ${question._id} thành công`
                  );
                },
                onError: (error) => {
                  console.error(
                    `Lỗi khi cập nhật quizId cho câu hỏi ${question._id}:`,
                    error
                  );
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

  const checkStatusDisabledButtonCreate = () =>
    !title ||
    !duration ||
    !selectedCategory ||
    !level ||
    selectedMultipleChoiceQuestions.length + selectedEssayQuestions.length < 1;

  const resetForm = () => {
    setTitle(null);
    setSelectedCategory(null);
    setDescription(null);
    setDuration(0);
    setLevel(1);
    setSelectedMultipleChoiceQuestions([]);
    setSelectedEssayQuestions([]);
    setMultipleChoiceSelectionOrder([]);
    setEssaySelectionOrder([]);
  };

  const { mutate: createCategory } = useCreateCategory();

  const showModal = () => setIsModalOpen(true);

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
      .catch((info) => console.log("Validate Failed:", info));
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
                  <Input
                    size="large"
                    value={title}
                    onChange={handleChangeTitle}
                  />
                </Form.Item>
              </Col>
              <Col span={12} style={{ padding: "0px 12px" }}>
                <Form.Item label="Mô tả đề thi">
                  <Input
                    size="large"
                    value={description}
                    onChange={handleChangeDescription}
                  />
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
                <Button
                  type="primary"
                  style={{ marginRight: "12px" }}
                  onClick={showModal}
                >
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
              <Col
                span={24}
                style={{
                  padding: "0px 12px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
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
                        paddingRight: "10px",
                      }}
                    >
                      {selectedMultipleChoiceQuestions.map(
                        (question, index) => (
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
                                <div
                                  key={answerIndex}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Checkbox
                                    disabled
                                    style={{ marginRight: "8px" }}
                                  />
                                  <Text>{`Đáp án ${String.fromCharCode(
                                    65 + answerIndex
                                  )}: ${answer.answerText}`}</Text>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
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
                        paddingRight: "10px",
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
                            <Text>
                              Loại câu hỏi: Tự luận (Không có đáp án mẫu)
                            </Text>
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
          <Button
            danger
            style={{ marginLeft: "12px" }}
            onClick={handleCloseForm}
          >
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
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {questionsData?.data
            ?.filter((question) => {
              const questionType =
                Array.isArray(question.questionType) &&
                question.questionType.length > 0
                  ? question.questionType[0]
                  : undefined;
              return (
                questionType === "single_choice" ||
                questionType === "multiple_choice"
              );
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
                  onChange={() =>
                    handleSelectMultipleChoiceQuestion(question._id)
                  }
                >
                  <Text strong>{question.questionText}</Text>
                  <Tag
                    type="secondary"
                    style={{ marginLeft: "10px" }}
                    color={
                      question.difficulty === "easy"
                        ? "green"
                        : question.difficulty === "medium"
                        ? "gold"
                        : "red"
                    }
                  >
                    {question.difficulty}
                  </Tag>
                </Checkbox>
                <div
                  style={{
                    marginLeft: "24px",
                    marginTop: "5px",
                    maxWidth: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  {question.answers?.map((answer, index) => (
                    <div key={index}>
                      <Text>{`Đáp án ${String.fromCharCode(65 + index)}: ${
                        answer.answerText
                      }`}</Text>
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
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {questionsData?.data
            ?.filter((question) => {
              const questionType =
                Array.isArray(question.questionType) &&
                question.questionType.length > 0
                  ? question.questionType[0]
                  : undefined;
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
                  <Tag
                    type="secondary"
                    style={{ marginLeft: "10px" }}
                    color={
                      question.difficulty === "easy"
                        ? "green"
                        : question.difficulty === "medium"
                        ? "gold"
                        : "red"
                    }
                  >
                    {question.difficulty}
                  </Tag>
                </Checkbox>
                <div
                  style={{
                    marginLeft: "24px",
                    marginTop: "5px",
                    maxWidth: "100%",
                    wordWrap: "break-word",
                  }}
                >
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
