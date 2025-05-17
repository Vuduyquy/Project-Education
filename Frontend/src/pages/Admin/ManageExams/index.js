// import React, { useState, useEffect } from "react";
// import { Button, Space, Table, Tooltip, notification, Modal, Input, Form, Select, Checkbox, Typography } from "antd";
// import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
// import { useGetExams, useDeleteExam, usePutExam } from "../../../apis/createExam.api";
// import { useGetCategory } from "../../../apis/categories.api";
// import { useGetQuestions } from "../../../apis/question.api";

// const { Text } = Typography;

// const ManageExams = () => {
//   const [listExams, setListExams] = useState([]);
//   const [api, contextHolder] = notification.useNotification();
//   const { confirm } = Modal;
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [form] = Form.useForm();
//   const [listCategory, setListCategory] = useState([]);
//   const [selectedMultipleChoiceQuestions, setSelectedMultipleChoiceQuestions] = useState([]);
//   const [selectedEssayQuestions, setSelectedEssayQuestions] = useState([]);
//   const [isMultipleChoiceModalOpen, setIsMultipleChoiceModalOpen] = useState(false);
//   const [isEssayModalOpen, setIsEssayModalOpen] = useState(false);
//   const [tempSelectedMultipleChoiceIds, setTempSelectedMultipleChoiceIds] = useState([]);
//   const [tempSelectedEssayIds, setTempSelectedEssayIds] = useState([]);

//   // Hook lấy danh sách danh mục
//   const { data: categoryData } = useGetCategory(
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
//       setListCategory(categoryData?.data?.data || []);
//     }
//   }, [categoryData]);

//   // Hook lấy danh sách đề thi
//   const { data: examData, isLoading: isLoadingExams, refetch } = useGetExams(
//     (data) => {
//       setListExams(data.data);
//     },
//     (error) => {
//       api.error({
//         message: "Không thể tải danh sách đề thi",
//         description: error.message,
//       });
//     }
//   );

//   // Hook lấy danh sách câu hỏi
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

//   useEffect(() => {
//     if (examData) {
//       setListExams(examData?.data?.data || []);
//     }
//   }, [examData]);

//   // Hook xóa đề thi
//   const { mutate: deleteExam } = useDeleteExam(
//     () => {
//       api.success({
//         message: "Xóa thành công",
//         description: "Đề thi đã được xóa thành công!",
//       });
//       refetch();
//     },
//     (error) => {
//       api.error({
//         message: "Không thể xóa",
//         description: error.message,
//       });
//     }
//   );

//   // Hook cập nhật đề thi
//   const { mutate: updateExams, isLoading: isUpdating } = usePutExam(
//     () => {
//       api.success({
//         message: "Cập nhật thành công",
//         description: "Đề thi đã được cập nhật!",
//       });
//       setIsEditModalOpen(false);
//       refetch();
//     },
//     (error) =>
//       api.error({ message: "Cập nhật thất bại", description: error.message })
//   );

//   // Hàm mở modal chỉnh sửa
//   const handleEditExams = (exam) => {
//     //console.log("Exam:", exam);

//     // Kiểm tra xem dữ liệu câu hỏi đã sẵn sàng chưa
//     if (isLoadingQuestions) {
//       api.warning({
//         message: "Đang tải dữ liệu",
//         description: "Vui lòng chờ trong giây lát...",
//       });
//       return;
//     }

//     if (!questionsData?.data) {
//       api.error({
//         message: "Lỗi dữ liệu",
//         description: "Không thể tải danh sách câu hỏi. Vui lòng thử lại sau.",
//       });
//       return;
//     }

//     setSelectedExam(exam);

//     // Kiểm tra và phân loại câu hỏi trắc nghiệm và tự luận
//     let multipleChoiceQuestions = [];
//     let essayQuestions = [];

//     if (Array.isArray(exam.questionCount)) {
//       // Chuẩn hóa dữ liệu: kiểm tra xem questionCount là mảng chuỗi hay mảng đối tượng
//       const questionIds = exam.questionCount.map((id) => {
//         if (typeof id === "string") {
//           return id.trim();
//         } else if (id && typeof id === "object" && id._id) {
//           return id._id.trim();
//         }
//         return null;
//       }).filter(id => id); // Loại bỏ các giá trị null

//       //console.log("Question IDs:", questionIds);

//       const questions = questionsData.data.filter((q) => {
//         const questionId = q._id.toString().trim();
//         const isIncluded = questionIds.includes(questionId);
//         //console.log(`Comparing question ID: ${questionId} with exam question IDs: ${questionIds} -> ${isIncluded}`);
//         return isIncluded;
//       }) || [];

//       //console.log("Filtered Questions:", questions);

//       // Phân loại câu hỏi
//       multipleChoiceQuestions = questions.filter((q) => {
//         const type = q.questionType?.[0];
//         //console.log(`Question ID: ${q._id}, Question Type: ${type}`);
//         return type === "single_choice" || type === "multiple_choice";
//       });

//       essayQuestions = questions.filter((q) => {
//         const type = q.questionType?.[0];
//         //console.log(`Question ID: ${q._id}, Question Type: ${type}`);
//         return type === "essay";
//       });

//       // console.log("Multiple Choice Questions:", multipleChoiceQuestions);
//       // console.log("Essay Questions:", essayQuestions);
//     } else {
//       console.log("No questions found in exam");
//     }

//     setSelectedMultipleChoiceQuestions(multipleChoiceQuestions);
//     setSelectedEssayQuestions(essayQuestions);

//     // Ánh xạ dữ liệu vào form
//     form.setFieldsValue({
//       title: exam.name || "",
//       duration: exam.duration || 0,
//       category: exam.category?.map((cat) => cat._id) || [],
//       level: exam.level || 1,
//     });

//     setIsEditModalOpen(true);
//   };

//   // Hàm cập nhật đề thi
//   const handleUpdateExam = () => {
//     form.validateFields().then((values) => {
//       const updatedExam = {
//         title: values.title,
//         duration: values.duration,
//         category: values.category,
//         level: values.level,
//         questions: [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions].map((q) => q._id),
//       };

//       updateExams({ id: selectedExam.id, payload: updatedExam });
//     });
//   };

//   // Hàm xóa đề thi
//   const handleDelete = (id) => {
//     confirm({
//       title: "Bạn có chắc chắn muốn xóa đề thi này?",
//       icon: <ExclamationCircleOutlined />,
//       content: "Hành động này không thể hoàn tác.",
//       okText: "Xóa",
//       okType: "danger",
//       cancelText: "Hủy",
//       onOk() {
//         deleteExam(id);
//       },
//     });
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

//   const columns = [
//     {
//       title: "Tên đề thi",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Thời gian",
//       dataIndex: "duration",
//       key: "duration",
//     },
//     {
//       title: "Môn thi",
//       dataIndex: "category",
//       key: "category",
//       render: (category) => (category ? category.map((l) => l.title).join(", ") : ""),
//     },
//     {
//       title: "Mức độ",
//       key: "level",
//       dataIndex: "level",
//     },
//     {
//       title: "Số lượng câu hỏi",
//       key: "questionCount",
//       dataIndex: "questionCount",
//       render: (questionCount) => (questionCount ? questionCount.length : 0),
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <Tooltip title="Chỉnh sửa">
//             <Button shape="circle" icon={<EditOutlined />} onClick={() => handleEditExams(record)} />
//           </Tooltip>
//           <Tooltip title="Xóa">
//             <Button
//               shape="circle"
//               icon={<DeleteOutlined />}
//               onClick={() => handleDelete(record.id)}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       {contextHolder}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: "12px",
//         }}
//       >
//         <h1>Danh sách đề thi</h1>
//       </div>
//       <Table
//         columns={columns}
//         dataSource={listExams.map((exam) => {
//           //console.log("Exam in Table:", exam); // Debug dữ liệu exam trước khi ánh xạ
//           return {
//             id: exam._id,
//             name: exam.title,
//             duration: exam.duration,
//             category: exam.category,
//             level: exam.level,
//             questionCount: exam.questions,
//           };
//         })}
//         loading={isLoadingExams}
//       />

//       {/* Modal chỉnh sửa đề thi */}
//       <Modal
//         title="Cập nhật đề thi"
//         open={isEditModalOpen}
//         onCancel={() => setIsEditModalOpen(false)}
//         onOk={handleUpdateExam}
//         okText="Lưu"
//         cancelText="Hủy"
//         confirmLoading={isUpdating}
//         width={800}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item name="title" label="Tên Đề thi">
//             <Input />
//           </Form.Item>
//           <Form.Item name="duration" label="Thời gian (phút)">
//             <Input type="number" />
//           </Form.Item>
//           <Form.Item name="category" label="Danh mục">
//             <Select
//               size="large"
//               placeholder="Chọn danh mục"
//               mode="multiple"
//             >
//               {listCategory?.map((category) => (
//                 <Select.Option key={category._id} value={category._id}>
//                   {category.title}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="level" label="Mức độ">
//             <Select
//               size="large"
//               options={[
//                 { value: 1, label: "Cơ bản" },
//                 { value: 2, label: "Trung bình" },
//                 { value: 3, label: "Nâng cao" },
//               ]}
//             />
//           </Form.Item>

//           {/* Phần Trắc nghiệm */}
//           <div style={{ marginBottom: "20px" }}>
//             <Text strong>Phần Trắc nghiệm</Text>
//             <div style={{ marginTop: "10px" }}>
//               <Button type="primary" onClick={showMultipleChoiceModal}>
//                 Thêm câu hỏi
//               </Button>
//             </div>
//             {selectedMultipleChoiceQuestions.length > 0 ? (
//               <div
//                 style={{
//                   marginTop: "20px",
//                   maxHeight: "200px",
//                   overflowY: "auto",
//                 }}
//               >
//                 {selectedMultipleChoiceQuestions.map((question, index) => (
//                   <div
//                     key={question._id}
//                     style={{
//                       marginTop: "10px",
//                       padding: "10px",
//                       border: "1px solid #d9d9d9",
//                       borderRadius: "4px",
//                     }}
//                   >
//                     <Text strong>{`Câu ${index + 1}: `}</Text>
//                     <Text>{question.questionText}</Text>
//                     <div style={{ marginTop: "5px" }}>
//                       {question.answers?.map((answer, answerIndex) => (
//                         <div key={answerIndex} style={{ display: "flex", alignItems: "center" }}>
//                           <Checkbox disabled style={{ marginRight: "8px" }} />
//                           <Text>{`Đáp án ${String.fromCharCode(65 + answerIndex)}: ${answer.answerText}`}</Text>
                          
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <Text style={{ color: "gray", marginTop: "10px", display: "block" }}>
//                 Chưa có câu hỏi trắc nghiệm nào.
//               </Text>
//             )}
//           </div>

//           {/* Phần Tự luận */}
//           <div>
//             <Text strong>Phần Tự luận</Text>
//             <div style={{ marginTop: "10px" }}>
//               <Button type="primary" onClick={showEssayModal}>
//                 Thêm câu hỏi
//               </Button>
//             </div>
//             {selectedEssayQuestions.length > 0 ? (
//               <div
//                 style={{
//                   marginTop: "20px",
//                   maxHeight: "200px",
//                   overflowY: "auto",
//                 }}
//               >
//                 {selectedEssayQuestions.map((question, index) => (
//                   <div
//                     key={question._id}
//                     style={{
//                       marginTop: "10px",
//                       padding: "10px",
//                       border: "1px solid #d9d9d9",
//                       borderRadius: "4px",
//                     }}
//                   >
//                     <Text strong>{`Câu ${index + 1}: `}</Text>
//                     <Text>{question.questionText}</Text>
//                     <div style={{ marginTop: "5px" }}>
//                       <Text>Loại câu hỏi: Tự luận (Không có đáp án mẫu)</Text>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <Text style={{ color: "gray", marginTop: "10px", display: "block" }}>
//                 Chưa có câu hỏi tự luận nào.
//               </Text>
//             )}
//           </div>
//         </Form>
//       </Modal>

//       {/* Modal chọn câu hỏi trắc nghiệm */}
//       <Modal
//         title="Chọn câu hỏi trắc nghiệm"
//         open={isMultipleChoiceModalOpen}
//         onOk={handleAddMultipleChoiceQuestions}
//         onCancel={() => setIsMultipleChoiceModalOpen(false)}
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
//         onCancel={() => setIsEssayModalOpen(false)}
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

// export default ManageExams;

import React, { useState, useEffect } from "react";
import { Button, Space, Table, Tooltip, notification, Modal, Input, Form, Select, Checkbox, Typography } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useGetExams, useDeleteExam, usePutExam } from "../../../apis/createExam.api";
import { useGetCategory } from "../../../apis/categories.api";
import { useGetQuestions } from "../../../apis/question.api";

const { Text } = Typography;

const ManageExams = () => {
  const [listExams, setListExams] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const { confirm } = Modal;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [form] = Form.useForm();
  const [listCategory, setListCategory] = useState([]);
  const [selectedMultipleChoiceQuestions, setSelectedMultipleChoiceQuestions] = useState([]);
  const [selectedEssayQuestions, setSelectedEssayQuestions] = useState([]);
  const [isMultipleChoiceModalOpen, setIsMultipleChoiceModalOpen] = useState(false);
  const [isEssayModalOpen, setIsEssayModalOpen] = useState(false);
  const [tempSelectedMultipleChoiceIds, setTempSelectedMultipleChoiceIds] = useState([]);
  const [tempSelectedEssayIds, setTempSelectedEssayIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho phân trang
  const [pageSize] = useState(5); // 5 đề thi mỗi trang

  // Hook lấy danh sách danh mục
  const { data: categoryData } = useGetCategory(
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
      setListCategory(categoryData?.data?.data || []);
    }
  }, [categoryData]);

  // Hook lấy danh sách đề thi với phân trang
  const { data: examData, isLoading: isLoadingExams, refetch } = useGetExams(
    currentPage,
    pageSize,
    (data) => {
      setListExams(data.data);
    },
    (error) => {
      api.error({
        message: "Không thể tải danh sách đề thi",
        description: error.message,
      });
    }
  );

  // Hook lấy danh sách câu hỏi
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

  useEffect(() => {
    if (examData) {
      setListExams(examData?.data || []);
    }
  }, [examData]);

  // Hook xóa đề thi
  const { mutate: deleteExam } = useDeleteExam(
    () => {
      api.success({
        message: "Xóa thành công",
        description: "Đề thi đã được xóa thành công!",
      });
      refetch();
    },
    (error) => {
      api.error({
        message: "Không thể xóa",
        description: error.message,
      });
    }
  );

  // Hook cập nhật đề thi
  const { mutate: updateExams, isLoading: isUpdating } = usePutExam(
    () => {
      api.success({
        message: "Cập nhật thành công",
        description: "Đề thi đã được cập nhật!",
      });
      setIsEditModalOpen(false);
      refetch();
    },
    (error) =>
      api.error({ message: "Cập nhật thất bại", description: error.message })
  );

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    console.log("Changing to page:", page);
    setCurrentPage(page);
    refetch(); // Gọi lại API khi trang thay đổi
  };

  // Hàm mở modal chỉnh sửa
  const handleEditExams = (exam) => {
    if (isLoadingQuestions) {
      api.warning({
        message: "Đang tải dữ liệu",
        description: "Vui lòng chờ trong giây lát...",
      });
      return;
    }

    if (!questionsData?.data) {
      api.error({
        message: "Lỗi dữ liệu",
        description: "Không thể tải danh sách câu hỏi. Vui lòng thử lại sau.",
      });
      return;
    }

    setSelectedExam(exam);

    let multipleChoiceQuestions = [];
    let essayQuestions = [];

    if (Array.isArray(exam.questionCount)) {
      const questionIds = exam.questionCount.map((id) => {
        if (typeof id === "string") {
          return id.trim();
        } else if (id && typeof id === "object" && id._id) {
          return id._id.trim();
        }
        return null;
      }).filter(id => id);

      const questions = questionsData.data.filter((q) => {
        const questionId = q._id.toString().trim();
        return questionIds.includes(questionId);
      }) || [];

      multipleChoiceQuestions = questions.filter((q) => {
        const type = q.questionType?.[0];
        return type === "single_choice" || type === "multiple_choice";
      });

      essayQuestions = questions.filter((q) => {
        const type = q.questionType?.[0];
        return type === "essay";
      });
    }

    setSelectedMultipleChoiceQuestions(multipleChoiceQuestions);
    setSelectedEssayQuestions(essayQuestions);

    form.setFieldsValue({
      title: exam.name || "",
      duration: exam.duration || 0,
      category: exam.category?.map((cat) => cat._id) || [],
      level: exam.level || 1,
    });

    setIsEditModalOpen(true);
  };

  // Hàm cập nhật đề thi
  const handleUpdateExam = () => {
    form.validateFields().then((values) => {
      const updatedExam = {
        title: values.title,
        duration: values.duration,
        category: values.category,
        level: values.level,
        questions: [...selectedMultipleChoiceQuestions, ...selectedEssayQuestions].map((q) => q._id),
      };

      updateExams({ id: selectedExam.id, payload: updatedExam });
    });
  };

  // Hàm xóa đề thi
  const handleDelete = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa đề thi này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        deleteExam(id);
      },
    });
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

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: "Tên đề thi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Môn thi",
      dataIndex: "category",
      key: "category",
      render: (category) => (category ? category.map((l) => l.title).join(", ") : ""),
    },
    {
      title: "Mức độ",
      key: "level",
      dataIndex: "level",
    },
    {
      title: "Số lượng câu hỏi",
      key: "questionCount",
      dataIndex: "questionCount",
      render: (questionCount) => (questionCount ? questionCount.length : 0),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditExams(record)}
              style={{
                backgroundColor: "#1890ff",
                color: "white",
                border: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#40a9ff";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1890ff";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              style={{
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ff7875";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ff4d4f";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Dữ liệu cho bảng
  const tableData = (listExams || []).map((exam) => ({
    id: exam._id,
    name: exam.title,
    duration: exam.duration,
    category: exam.category,
    level: exam.level,
    questionCount: exam.questions,
  }));

  // Style cho bảng
  const tableStyle = {
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "white",
        minHeight: "100px",
      }}
    >
      {contextHolder}
      <h1
        style={{
          color: "black",
          fontSize: "20px",
          marginBottom: "20px",
        }}
      >
        Danh sách đề thi
      </h1>
      <div style={{ maxHeight: "500px", overflow: "auto" }}>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoadingExams}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: examData?.pagination?.total || 0, // Lấy total từ phản hồi API
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} đề thi`,
            itemRender: (current, type, originalElement) => {
              if (type === "prev") {
                return (
                  <a
                    style={{
                      color: "#1890ff",
                      fontWeight: "bold",
                      padding: "5px 10px",
                    }}
                  >
                    Trước
                  </a>
                );
              }
              if (type === "next") {
                return (
                  <a
                    style={{
                      color: "#1890ff",
                      fontWeight: "bold",
                      padding: "5px 10px",
                    }}
                  >
                    Sau
                  </a>
                );
              }
              return originalElement;
            },
          }}
          style={tableStyle}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    backgroundColor: "#1890ff",
                    color: "white",
                    fontSize: "13px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                />
              ),
            },
          }}
          rowClassName={() => "custom-row"}
          onRow={() => ({
            onMouseEnter: (event) => {
              event.currentTarget.style.backgroundColor = "#f0f0f0";
              event.currentTarget.style.transition = "all 0.3s";
            },
            onMouseLeave: (event) => {
              event.currentTarget.style.backgroundColor = "white";
            },
          })}
        />
      </div>

      {/* Modal chỉnh sửa đề thi */}
      <Modal
        title="Cập nhật đề thi"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdateExam}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isUpdating}
        width={800}
        style={{ top: "20px" }}
        bodyStyle={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}
        okButtonProps={{
          style: {
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            borderRadius: "4px",
            padding: "5px 15px",
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "4px",
            padding: "5px 15px",
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tên Đề thi">
            <Input
              style={{
                borderRadius: "4px",
                padding: "8px",
                borderColor: "#d9d9d9",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#1890ff";
                e.currentTarget.style.boxShadow = "0 0 5px #1890ff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d9d9d9";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </Form.Item>
          <Form.Item name="duration" label="Thời gian (phút)">
            <Input
              type="number"
              style={{
                borderRadius: "4px",
                padding: "8px",
                borderColor: "#d9d9d9",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#1890ff";
                e.currentTarget.style.boxShadow = "0 0 5px #1890ff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d9d9d9";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </Form.Item>
          <Form.Item name="category" label="Danh mục">
            <Select
              size="large"
              placeholder="Chọn danh mục"
              mode="multiple"
              style={{
                width: "100%",
                borderRadius: "4px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#1890ff";
                e.currentTarget.style.boxShadow = "0 0 5px #1890ff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d9d9d9";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {listCategory?.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="level" label="Mức độ">
            <Select
              size="large"
              options={[
                { value: 1, label: "Cơ bản" },
                { value: 2, label: "Trung bình" },
                { value: 3, label: "Nâng cao" },
              ]}
              style={{
                width: "100%",
                borderRadius: "4px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#1890ff";
                e.currentTarget.style.boxShadow = "0 0 5px #1890ff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d9d9d9";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </Form.Item>

          {/* Phần Trắc nghiệm */}
          <div style={{ marginBottom: "20px" }}>
            <Text strong>Phần Trắc nghiệm</Text>
            <div style={{ marginTop: "10px" }}>
              <Button
                type="primary"
                onClick={showMultipleChoiceModal}
                style={{
                  borderRadius: "4px",
                  padding: "5px 15px",
                }}
              >
                Thêm câu hỏi
              </Button>
            </div>
            {selectedMultipleChoiceQuestions.length > 0 ? (
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
            ) : (
              <Text style={{ color: "gray", marginTop: "10px", display: "block" }}>
                Chưa có câu hỏi trắc nghiệm nào.
              </Text>
            )}
          </div>

          {/* Phần Tự luận */}
          <div>
            <Text strong>Phần Tự luận</Text>
            <div style={{ marginTop: "10px" }}>
              <Button
                type="primary"
                onClick={showEssayModal}
                style={{
                  borderRadius: "4px",
                  padding: "5px 15px",
                }}
              >
                Thêm câu hỏi
              </Button>
            </div>
            {selectedEssayQuestions.length > 0 ? (
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
            ) : (
              <Text style={{ color: "gray", marginTop: "10px", display: "block" }}>
                Chưa có câu hỏi tự luận nào.
              </Text>
            )}
          </div>
        </Form>
      </Modal>

      {/* Modal chọn câu hỏi trắc nghiệm */}
      <Modal
        title="Chọn câu hỏi trắc nghiệm"
        open={isMultipleChoiceModalOpen}
        onOk={handleAddMultipleChoiceQuestions}
        onCancel={() => setIsMultipleChoiceModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
        style={{ top: "20px" }}
        bodyStyle={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}
        okButtonProps={{
          style: {
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            borderRadius: "4px",
            padding: "5px 15px",
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "4px",
            padding: "5px 15px",
          },
        }}
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
        onCancel={() => setIsEssayModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
        width={800}
        style={{ top: "20px" }}
        bodyStyle={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}
        okButtonProps={{
          style: {
            backgroundColor: "#1890ff",
            borderColor: "#1890ff",
            borderRadius: "4px",
            padding: "5px 15px",
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "4px",
            padding: "5px 15px",
          },
        }}
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

export default ManageExams;