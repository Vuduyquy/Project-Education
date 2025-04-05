// import React, { useState, useEffect } from "react";
// import { Button, Space, Table, Tooltip, notification, Modal, Input, Form, Select, Radio, } from "antd";
// import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
// import { useGetExams, useDeleteExam, usePutExam } from "../../../apis/createExam.api";
// import { useGetCategory } from "../../../apis/categories.api";

// const ManageExams = () => {
//   const [listExams, setListExams] = useState([]);
//   const [api, contextHolder] = notification.useNotification();
//   const { confirm } = Modal;
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [form] = Form.useForm();
//   const [selectCategory, setSelectCategory] = useState([]);
//   const [listCategory, setListCategory] = useState([]);

//   // Hook lấy danh sách bài học
//   const { data: categoryData } = useGetCategory(
//     (data) => {
//       //console.log("Lesson Data:", data);
//       setListCategory(data.data); // Đảm bảo cập nhật đúng dữ liệu
//     },
//     (error) => {
//       api.error({
//         message: "Không thể tải danh mục",
//         description: error.message,
//       });
//     }
//   );

//   // Cập nhật danh mục khi `lessonData` thay đổi
//   useEffect(() => {
//     if (categoryData) {
//       console.log("Updating listLesson with:", categoryData.data.data);
//       setListCategory(categoryData?.data.data);
//     }
//   }, [categoryData]);
//   console.log("Dữ liệu lessonData:", categoryData);

//   // Hook để lấy danh sách đề thi  
//   const { data: examData, isLoading: isLoadingCategory, refetch } = useGetExams(
//     (data) => {
//       setListExams(data.data); // Đảm bảo cập nhật đúng dữ liệu
//     },
//     (error) => {
//       api.error({
//         message: "Không thể tải danh mục",
//         description: error.message,
//       });
//     }
//   );

//   // Hook để xóa đề thi
//   const { mutate: deleteExam } = useDeleteExam(
//     () => {
//       api.success({
//         message: "Xóa thành công",
//         description: "Đề thi đã được xóa thành công!",
//       });
//       refetch(); // Tải lại danh sách sau khi xóa
//     },
//     (error) => {
//       api.error({
//         message: "Không thể xóa",
//         description: error.message,
//       });
//     }
//   );

//   // Hook cập nhật khóa học
//   const { mutate: updateExams, isLoading: isUpdating } = usePutExam(
//     () => {
//       api.success({
//         message: "Cập nhật thành công",
//         description: "Khóa học đã được cập nhật!",
//       });
//       setIsEditModalOpen(false);
//       refetch();
//     },
//     (error) =>
//       api.error({ message: "Cập nhật thất bại", description: error.message })
//   );

//   const handleEditExams = (exam) => {
//     console.log('Exams:', exam);
//     setSelectedCourse(exam);
  
//     form.setFieldsValue({
//       title: exam.name,
//       duration: exam.duration,
//       questionCount: exam.questionCount?.length,
//       category: exam.category.map((category) => category._id),
//       level: exam.level,
//       questions: exam.questionCount.map((question) => ({
//         questionText: question.questionText,
//         answers: question.answers,
//         correctAnswer: question.correctAnswer,
//       })),
//     });
  
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateExam = () => {
//     form.validateFields().then((values) => {
//       const updatedExam = {
//         title: values.title,
//         duration: values.duration,
//         category: values.category,
//         level: values.level,
//         questions: values.questions.map((question) => ({
//           questionText: question.questionText,
//           answers: question.answers,
//           correctAnswer: question.correctAnswer,
//         })),
//       };
  
//       updateExams({ id: selectedCourse.id, payload: updatedExam });
//     });
//   };
  
  

//   // const handleEditExams = (exam) => {
//   //   console.log('Exams:', exam)
//   //   setSelectedCourse(exam);

    
//   //   form.setFieldsValue({
//   //     title: exam.name,
//   //     duration: exam.duration,
//   //     questionCount: exam.questionCount?.length,
//   //     category: exam.category.map((category) => category._id),
//   //     level: exam.level,
//   //   });

//   //   setIsEditModalOpen(true);
//   // };

//   // const handleUpdateExam = () => {
//   //   form.validateFields().then((values) => {
//   //     const updatedExam = {
//   //       title: values.title,
//   //       duration: values.duration,
//   //       category: values.category,
//   //       level: values.level,
//   //     };
//   //     updateExams({ id: selectedCourse.id, payload: updatedExam });
//   //   });
//   // };

//   // Hàm xóa đề thi với xác nhận
//   const handleDelete = (id) => {
// 	console.log('key:', id)
//     confirm({
//       title: "Bạn có chắc chắn muốn xóa đề thi này?",
//       icon: <ExclamationCircleOutlined />,
//       content: "Hành động này không thể hoàn tác.",
//       okText: "Xóa",
//       okType: "danger",
//       cancelText: "Hủy",
//       onOk() {
//         deleteExam(id); // Gọi API xóa đề thi
//       },
//     });
//   };

//   useEffect(() => {
//     if (examData) {
//       setListExams(examData?.data?.data);
//     }
//   }, [examData]);
//   console.log('examData:', examData)


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
//       render: (category) => category.map((l) => l.title).join(", "),
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
//       render: (questionCount) => questionCount.length,
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <Tooltip title="Chỉnh sửa">
//             <Button shape="circle" icon={<EditOutlined />} onClick={() => handleEditExams(record)}/>
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
//         <h1>Danh sách đề thi </h1>
//       </div>
//       <Table
//         columns={columns}
//         dataSource={listExams.map((exam) => ({
//           id: exam._id, // Dùng _id làm khóa chính
//           name: exam.title,
//           duration: exam.duration,
//           category: exam.category,
//           level: exam.level,
//           questionCount: exam.questions,  
//         }))}
//         loading={isLoadingCategory}
//       />

      

// {/* <Modal
//         title="Cập nhật khóa học"
//         open={isEditModalOpen}
//         onCancel={() => setIsEditModalOpen(false)}
//         onOk={handleUpdateExam}
//         okText="Lưu"
//         cancelText="Hủy"
//         confirmLoading={isUpdating}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="title"
//             label="Tên Đề thi"
//             //rules={[{ required: true, message: "Vui lòng nhập tên đề thi" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item name="duration" label="Thời gian">
//             <Input />
//           </Form.Item>
//           <Form.Item name="questionCount" label="Số lượng câu hỏi">
//             <Input disabled/>
//           </Form.Item>
//           <Form.Item name="category" label="Danh mục">
//           <Select
//               size="large"
//               //mode="multiple"
//               placeholder="Chọn list bài giảng liên quan"
//               value={selectCategory}
//               onChange={(value) => setSelectCategory(value)}
//               loading={isLoadingCategory}
//             >
//               {listCategory?.map((category) => (
//                 <Select.Option key={category._id} value={category._id}>
//                   {category.title}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="level" label="Mức độ">
//             <Input disabled />
//           </Form.Item>
//         </Form>
//       </Modal> */}

// <Modal
//   title="Cập nhật đề thi"
//   open={isEditModalOpen}
//   onCancel={() => setIsEditModalOpen(false)}
//   onOk={handleUpdateExam}
//   okText="Lưu"
//   cancelText="Hủy"
//   confirmLoading={isUpdating}
//   width={800} // Tăng kích thước modal
// >
//   <Form form={form} layout="vertical">
//     {/* Tên đề thi */}
//     <Form.Item name="title" label="Tên Đề thi">
//       <Input />
//     </Form.Item>

//     {/* Thời gian làm bài */}
//     <Form.Item name="duration" label="Thời gian (phút)">
//       <Input />
//     </Form.Item>

//     {/* Số lượng câu hỏi */}
//     <Form.Item name="questionCount" label="Số lượng câu hỏi">
//       <Input disabled />
//     </Form.Item>

//     {/* Chọn danh mục */}
//     <Form.Item name="category" label="Danh mục">
//       <Select
//         size="large"
//         placeholder="Chọn danh mục"
//         value={selectCategory}
//         onChange={(value) => setSelectCategory(value)}
//         mode="multiple"
//       >
//         {listCategory?.map((category) => (
//           <Select.Option key={category._id} value={category._id}>
//             {category.title}
//           </Select.Option>
//         ))}
//       </Select>
//     </Form.Item>

//     {/* Danh sách câu hỏi */}
//     <Form.List name="questions">
//       {(fields, { add, remove }) => (
//         <>
//           {fields.map(({ key, name, fieldKey }) => (
//             <div key={key} style={{ borderBottom: "1px solid #ddd", paddingBottom: 10, marginBottom: 10 }}>
//               <Form.Item
//                 name={[name, "questionText"]}
//                 label="Câu hỏi"
//                 rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}
//               >
//                 <Input placeholder="Nhập câu hỏi..." />
//               </Form.Item>

//               {/* Nhóm đáp án */}
//               <Form.Item label="Đáp án" rules={[{ required: true, message: "Vui lòng nhập đáp án" }]}>
//                 <Radio.Group>
//                   {["A", "B", "C", "D"].map((option, index) => (
//                     <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
//                       <Radio value={option} style={{ marginRight: 8 }} />
//                       <Form.Item
//                         name={[name, "answers", index]}
//                         rules={[{ required: true, message: "Nhập đáp án" }]}
//                         style={{ flex: 1, marginBottom: 0 }}
//                       >
//                         <Input placeholder={`Nhập đáp án ${option}`} />
//                       </Form.Item>
//                     </div>
//                   ))}
//                 </Radio.Group>
//               </Form.Item>

//               <Form.Item
//                 name={[name, "correctAnswer"]}
//                 label="Đáp án đúng"
//                 rules={[{ required: true, message: "Chọn đáp án đúng" }]}
//               >
//                 <Select placeholder="Chọn đáp án đúng">
//                   {["A", "B", "C", "D"].map((option) => (
//                     <Select.Option key={option} value={option}>
//                       {option}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Button danger onClick={() => remove(name)}>Xóa câu hỏi</Button>
//             </div>
//           ))}

//           <Button type="dashed" onClick={() => add({ answers: ["", "", "", ""], correctAnswer: null })}>
//             + Thêm câu hỏi
//           </Button>
//         </>
//       )}
//     </Form.List>
//   </Form>
// </Modal>

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

  // Hook lấy danh sách đề thi
  const { data: examData, isLoading: isLoadingExams, refetch } = useGetExams(
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
      setListExams(examData?.data?.data || []);
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

  // Hàm mở modal chỉnh sửa
  const handleEditExams = (exam) => {
    //console.log("Exam:", exam);

    // Kiểm tra xem dữ liệu câu hỏi đã sẵn sàng chưa
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

    // Kiểm tra và phân loại câu hỏi trắc nghiệm và tự luận
    let multipleChoiceQuestions = [];
    let essayQuestions = [];

    if (Array.isArray(exam.questionCount)) {
      // Chuẩn hóa dữ liệu: kiểm tra xem questionCount là mảng chuỗi hay mảng đối tượng
      const questionIds = exam.questionCount.map((id) => {
        if (typeof id === "string") {
          return id.trim();
        } else if (id && typeof id === "object" && id._id) {
          return id._id.trim();
        }
        return null;
      }).filter(id => id); // Loại bỏ các giá trị null

      //console.log("Question IDs:", questionIds);

      const questions = questionsData.data.filter((q) => {
        const questionId = q._id.toString().trim();
        const isIncluded = questionIds.includes(questionId);
        //console.log(`Comparing question ID: ${questionId} with exam question IDs: ${questionIds} -> ${isIncluded}`);
        return isIncluded;
      }) || [];

      //console.log("Filtered Questions:", questions);

      // Phân loại câu hỏi
      multipleChoiceQuestions = questions.filter((q) => {
        const type = q.questionType?.[0];
        //console.log(`Question ID: ${q._id}, Question Type: ${type}`);
        return type === "single_choice" || type === "multiple_choice";
      });

      essayQuestions = questions.filter((q) => {
        const type = q.questionType?.[0];
        //console.log(`Question ID: ${q._id}, Question Type: ${type}`);
        return type === "essay";
      });

      // console.log("Multiple Choice Questions:", multipleChoiceQuestions);
      // console.log("Essay Questions:", essayQuestions);
    } else {
      console.log("No questions found in exam");
    }

    setSelectedMultipleChoiceQuestions(multipleChoiceQuestions);
    setSelectedEssayQuestions(essayQuestions);

    // Ánh xạ dữ liệu vào form
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
            <Button shape="circle" icon={<EditOutlined />} onClick={() => handleEditExams(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h1>Danh sách đề thi</h1>
      </div>
      <Table
        columns={columns}
        dataSource={listExams.map((exam) => {
          //console.log("Exam in Table:", exam); // Debug dữ liệu exam trước khi ánh xạ
          return {
            id: exam._id,
            name: exam.title,
            duration: exam.duration,
            category: exam.category,
            level: exam.level,
            questionCount: exam.questions,
          };
        })}
        loading={isLoadingExams}
      />

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
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tên Đề thi">
            <Input />
          </Form.Item>
          <Form.Item name="duration" label="Thời gian (phút)">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="category" label="Danh mục">
            <Select
              size="large"
              placeholder="Chọn danh mục"
              mode="multiple"
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
            />
          </Form.Item>

          {/* Phần Trắc nghiệm */}
          <div style={{ marginBottom: "20px" }}>
            <Text strong>Phần Trắc nghiệm</Text>
            <div style={{ marginTop: "10px" }}>
              <Button type="primary" onClick={showMultipleChoiceModal}>
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
              <Button type="primary" onClick={showEssayModal}>
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