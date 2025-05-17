// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Space,
//   Table,
//   Tooltip,
//   notification,
//   Modal,
//   Input,
//   Form,
//   Select,
//   message,
//   Upload,
//   List,
// } from "antd";
// import {
//   DeleteOutlined,
//   EditOutlined,
//   ExclamationCircleOutlined,
//   InboxOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import {
//   useGetExams,
//   useDeleteExam,
//   usePutExam,
// } from "../../../apis/createExam.api";
// import { useGetCategory } from "../../../apis/categories.api";
// import { useDeleteLesson, useGetLesson, useUpdateLesson } from "../../../apis/lessons.api";
// import { useGetCourses, useUpdateCourses } from "../../../apis/courses.api";
// import Dragger from "antd/es/upload/Dragger";
// import axios from "axios";

// const ManageLesson = () => {
//   const [listLesson, setListLesson] = useState([]);
//   const [api, contextHolder] = notification.useNotification();
//   const { confirm } = Modal;
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [form] = Form.useForm();
//   const [selectCourse, setSelectCourse] = useState([]);
//   const [listCourse, setListCourse] = useState([]);
//   const [fileList, setFileList] = useState([]);
//   const [resources, setResources] = useState([]);
//   const [oldCourseId, setOldCourseId] = useState(null);

//   //Hook lấy danh sách bài học
//   const { data: courseData, refetch: refetchCourses } = useGetCourses(
//     (data) => {
//       //console.log("Lesson Data:", data);
//       setListCourse(data.data); // Đảm bảo cập nhật đúng dữ liệu
//     },
//     (error) => {
//       api.error({
//         message: "Không thể tải danh mục",
//         description: error.message,
//       });
//     }
//   );

//   // // Cập nhật danh mục khi `lessonData` thay đổi
//   useEffect(() => {
//     if (courseData) {
//       console.log("Updating listLesson with:", courseData.data);
//       setListCourse(courseData?.data);
//     }
//   }, [courseData]);
//   console.log("Dữ liệu courseData:", courseData);

//   // Hook để lấy danh sách đề thi
//   const {
//     data: lessonData,
//     isLoading: isLoadingCategory,
//     refetch,
//   } = useGetLesson(
//     (data) => {
//       setListLesson(data.data); // Đảm bảo cập nhật đúng dữ liệu
//     },
//     (error) => {
//       api.error({
//         message: "Không thể tải danh mục",
//         description: error.message,
//       });
//     }
//   );

//   useEffect(() => {
//     if (lessonData) {
//       setListLesson(lessonData?.data?.data);
//     }
//   }, [lessonData]);
//   console.log("lessonData:", lessonData);

//   //Hook để xóa bài giảng
//   const { mutate: deleteLesson } = useDeleteLesson(
//     () => {
//       api.success({
//         message: "Xóa thành công",
//         description: "bài giảng đã được xóa thành công!",
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

//   // Hook cập nhật bài thi
//   const { mutate: updateLesson, isLoading: isUpdating } = useUpdateLesson(
//     () => {
//       api.success({
//         message: "Cập nhật thành công",
//         description: "bài thi đã được cập nhật!",
//       });
//       setIsEditModalOpen(false);
//       refetch();
//     },
//     (error) =>
//       api.error({ message: "Cập nhật thất bại", description: error.message })
//   );

//   const handleEditLesson = (lesson) => {
//     console.log('leson:', lesson);
//     setSelectedLesson(lesson);
//     // Lưu oldCourseId ban đầu
//   const initialCourseId = lesson.courseId?._id || lesson.courseId || lesson.course?._id || lesson.course;
//   setOldCourseId(initialCourseId);
//   console.log("Initial Old Course ID:", initialCourseId);
//     form.setFieldsValue({
//       title: lesson.name,
//       content: lesson.content,
//       course: initialCourseId,
//     });

//     setResources(lesson.resources || []);
//     setFileList(
//       lesson.resources?.map((url, index) => ({
//         uid: index,
//         name: `Video ${index + 1}`,
//         status: "done",
//         url,
//       })) || []
//     );

//     setIsEditModalOpen(true);
//   };

//   const handleUploadVideo = async (file) => {
//     const formData = new FormData();
//     formData.append("video", file);

//     try {
//       const response = await axios.post("http://localhost:4000/api/v1/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       return response.data.videoUrl; // Lấy URL video từ API
//     } catch (error) {
//       console.error("Lỗi upload video:", error);
//       message.error("Tải video lên thất bại!");
//       return null;
//     }
//   };

//   const handleResourceChange = async (file) => {
//     if (!file || !file.type || !file.type.startsWith("video/")) {
//       message.error("Vui lòng chỉ upload file video!");
//       return;
//     }

//     const videoUrl = await handleUploadVideo(file);
//     if (videoUrl) {
//       setResources((prev) => [...prev, videoUrl]);
//       setFileList((prev) => [
//         ...prev,
//         {
//           uid: prev.length,
//           name: file.name,
//           status: "done",
//           url: videoUrl,
//         },
//       ]);
//     }
//   };

//   const { mutate: updateCourse } = useUpdateCourses();

//   const handleUpdateLesson = () => {
//     form.validateFields().then((values) => {
//       console.log("Form values:", values);
  
//       const updatedLesson = {
//         title: values.title,
//         content: values.content,
//         resources: resources,
//         courseId: values.course,
//       };
//       console.log("Updated Lesson:", updatedLesson);
  
//       // Log selectedLesson để kiểm tra
//       console.log("Selected Lesson:", selectedLesson);
  
//       // Cập nhật bài giảng với khóa học mới
//       updateLesson(
//         { id: selectedLesson.id, payload: updatedLesson },
//         {
//           onSuccess: async () => {
//             try {
//               // Làm mới danh sách khóa học trước khi thực hiện logic
//               await refetchCourses();
//               console.log("Refreshed listCourse:", listCourse);
  
//               // 1. Xóa bài giảng khỏi khóa học cũ (nếu có thay đổi khóa học)
//               const newCourseId = values.course; // ID khóa học mới
  
//               console.log("Old Course ID (from state):", oldCourseId);
//               console.log("New Course ID:", newCourseId);
//               console.log("Selected Lesson ID:", selectedLesson.id);
  
//               if (oldCourseId && oldCourseId !== newCourseId) {
//                 // Chuẩn hóa oldCourseId thành chuỗi
//                 const oldCourseIdStr = oldCourseId.toString();
  
//                 // Tìm khóa học cũ trong listCourse
//                 const oldCourse = listCourse.find((course) => {
//                   const courseIdStr = course._id.toString();
//                   console.log(
//                     `Comparing course._id: ${courseIdStr} with oldCourseId: ${oldCourseIdStr}`
//                   );
//                   return courseIdStr === oldCourseIdStr;
//                 });
  
//                 if (!oldCourse) {
//                   console.warn("Old course not found in listCourse:", oldCourseId);
//                   return;
//                 }
  
//                 // Log oldCourse để kiểm tra
//                 console.log("Old Course:", oldCourse);
  
//                 // Lấy danh sách lessons của khóa học cũ
//                 const oldLessons = Array.isArray(oldCourse?.lessons)
//                   ? oldCourse.lessons
//                   : [];
//                 console.log("Old Lessons before update:", oldLessons);
  
//                 // Kiểm tra xem lessonId có trong oldLessons không
//                 const lessonExistsInOldCourse = oldLessons.some((lesson) => {
//                   // Nếu lesson là đối tượng, lấy _id; nếu là chuỗi, sử dụng trực tiếp
//                   const lessonId = typeof lesson === 'object' && lesson._id ? lesson._id : lesson;
//                   return lessonId.toString() === selectedLesson.id;
//                 });
  
//                 if (!lessonExistsInOldCourse) {
//                   console.warn(
//                     "Lesson ID not found in old course lessons:",
//                     selectedLesson.id
//                   );
//                   console.log("Skipping removal as lesson is not in old course.");
//                 } else {
//                   // Lọc bài giảng ra khỏi danh sách lessons của khóa học cũ
//                   const updatedOldLessons = oldLessons
//                     .filter((lesson) => {
//                       const lessonId = typeof lesson === 'object' && lesson._id ? lesson._id : lesson;
//                       return lessonId.toString() !== selectedLesson.id;
//                     })
//                     .map((lesson) => {
//                       // Nếu lesson là đối tượng, chỉ giữ lại _id; nếu là chuỗi, giữ nguyên
//                       return typeof lesson === 'object' && lesson._id ? lesson._id : lesson;
//                     });
  
//                   console.log("Updated Old Lessons:", updatedOldLessons);
  
//                   // Cập nhật khóa học cũ (xóa lessonId)
//                   await updateCourse(
//                     {
//                       id: oldCourseId,
//                       payload: { lessons: updatedOldLessons },
//                     },
//                     {
//                       onSuccess: () => {
//                         console.log("Successfully removed lesson from old course:", oldCourseId);
//                       },
//                       onError: (error) => {
//                         console.error("Error removing lesson from old course:", error);
//                         api.error({
//                           message: "Không thể xóa bài giảng khỏi khóa học cũ",
//                           description: error.message,
//                         });
//                       },
//                     }
//                   );
//                 }
//               } else {
//                 console.log("No need to remove lesson from old course (same course or no old course).");
//               }
  
//               // 2. Thêm bài giảng vào khóa học mới
//               const newCourse = listCourse.find(
//                 (course) => course._id.toString() === newCourseId.toString()
//               );
//               if (!newCourse) {
//                 console.warn("New course not found in listCourse:", newCourseId);
//                 return;
//               }
  
//               const newLessons = Array.isArray(newCourse?.lessons)
//                 ? newCourse.lessons
//                 : [];
//               const updatedNewLessons = [...newLessons, selectedLesson.id].filter(
//                 (id, index, self) => self.indexOf(id) === index // Loại bỏ trùng lặp
//               );
  
//               console.log("New Lessons before update:", newLessons);
//               console.log("Updated New Lessons:", updatedNewLessons);
  
//               // Cập nhật khóa học mới (thêm lessonId)
//               await updateCourse(
//                 {
//                   id: newCourseId,
//                   payload: { lessons: updatedNewLessons },
//                 },
//                 {
//                   onSuccess: () => {
//                     console.log("Successfully added lesson to new course:", newCourseId);
//                   },
//                   onError: (error) => {
//                     console.error("Error adding lesson to new course:", error);
//                     api.error({
//                       message: "Không thể thêm bài giảng vào khóa học mới",
//                       description: error.message,
//                     });
//                   },
//                 }
//               );
  
//               // Làm mới dữ liệu
//               await refetch(); // Làm mới danh sách bài giảng
//               await refetchCourses(); // Làm mới danh sách khóa học
  
//               api.success({ message: "Cập nhật bài giảng và khóa học thành công" });
//               setIsEditModalOpen(false);
//             } catch (error) {
//               console.error("Error during course update:", error);
//               api.error({
//                 message: "Có lỗi xảy ra khi cập nhật khóa học",
//                 description: error.message,
//               });
//             }
//           },
//           onError: (error) => {
//             console.error("Error updating lesson:", error);
//             api.error({
//               message: "Cập nhật bài giảng thất bại",
//               description: error.message,
//             });
//           },
//         }
//       );
//     });
//   };
  
  


//   // const handleUpdateLesson = () => {
//   //   form.validateFields().then((values) => {
//   //     const updatedLesson = {
//   //       title: values.title,
//   //       content: values.content,
//   //       resources: resources,
//   //       courseId: values.course,
//   //     };
//   //     updateLesson({ id: selectedLesson.id, payload: updatedLesson });
//   //   });
//   // };


//   //Hàm xóa bài giảng với xác nhận
//   const handleDelete = (id) => {
//   console.log('key:', id)
//     confirm({
//       title: "Bạn có chắc chắn muốn xóa bài giảng này?",
//       icon: <ExclamationCircleOutlined />,
//       content: "Hành động này không thể hoàn tác.",
//       okText: "Xóa",
//       okType: "danger",
//       cancelText: "Hủy",
//       onOk() {
//         deleteLesson(id); // Gọi API xóa bài giảng
//       },
//     });
//   };


//   const columns = [
//     {
//       title: "Tiêu đề bài giảng",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Nội dung bài giảng",
//       dataIndex: "content",
//       key: "content",
//     },
//     {
//       title: "Tài liệu bài giảng",
//       dataIndex: "resources",
//       key: "resources",
// },
//     {
//       title: "Khoá học liên quan",
//       key: "course",
//       dataIndex: "course",
//       //render: (courses) => courses?.map((course) => course.title).join(", ") || "Chưa có khóa học",
//       render: (course) => (course?.title ? course.title : "Chưa có khóa học"),
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <Tooltip title="Chỉnh sửa">
//             <Button
//               shape="circle"
//               icon={<EditOutlined />}
//               onClick={() => handleEditLesson(record)}
//             />
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
//         dataSource={listLesson.map((lesson) => ({
//           id: lesson._id, // Dùng _id làm khóa chính
//           name: lesson.title,
//           content: lesson.content,
//           resources: lesson.resources,
//           course: lesson.courseId,
//           // questionCount: exam.questions,
//         }))}
//         loading={isLoadingCategory}
//       />

//       <Modal
//         title="Cập nhật khóa học"
//         open={isEditModalOpen}
//         onCancel={() => setIsEditModalOpen(false)}
//         onOk={handleUpdateLesson}
//         okText="Lưu"
//         cancelText="Hủy"
//         confirmLoading={isUpdating}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="title"
//             label="Tên bài giảng"
//             //rules={[{ required: true, message: "Vui lòng nhập tên đề thi" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item name="content" label="Nội dung bài giảng">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Tài liệu bài giảng (Chỉ video)">
//             <Upload.Dragger
//               multiple={false}
//               beforeUpload={(file) => {
//                 handleResourceChange(file);
//                 return false;
//               }}
//               fileList={fileList}
//               showUploadList={{
//                 showRemoveIcon: true,
//                 removeIcon: <Button danger>Xoá</Button>,
//               }}
//               onRemove={(file) => {
//                 setResources(resources.filter((url) => url !== file.url));
//                 setFileList(fileList.filter((item) => item.uid !== file.uid));
//               }}
//             >
//               <p className="ant-upload-drag-icon">
//                 <InboxOutlined />
//               </p>
//               <p className="ant-upload-text">Kéo thả video vào đây hoặc bấm để chọn file</p>
//               <p className="ant-upload-hint">Chỉ hỗ trợ file video.</p>
//             </Upload.Dragger>
//           </Form.Item>
//           <Form.Item name="course" label="Khoá học liên quan">
//           <Select
//               size="large"
//               //mode="multiple"
//               placeholder="Chọn khóa học"
//               value={selectCourse}
//               onChange={(value) => setSelectCourse(value)}
//               loading={isLoadingCategory}
//             >
//               {listCourse?.map((course) => (
//                 <Select.Option key={course._id} value={course._id}>
//                   {course.title}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ManageLesson;

import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Table,
  Tooltip,
  notification,
  Modal,
  Input,
  Form,
  Select,
  message,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  useGetLesson,
  useDeleteLesson,
  useUpdateLesson,
} from "../../../apis/lessons.api";
import { useGetCourses, useUpdateCourses } from "../../../apis/courses.api";
import Dragger from "antd/es/upload/Dragger";
import axios from "axios";

const ManageLesson = () => {
  const [listLesson, setListLesson] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const { confirm } = Modal;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [form] = Form.useForm();
  const [selectCourse, setSelectCourse] = useState([]);
  const [listCourse, setListCourse] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [resources, setResources] = useState([]);
  const [oldCourseId, setOldCourseId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Hook lấy danh sách khóa học
  const { data: courseData, refetch: refetchCourses } = useGetCourses(
    1,
    10,
    (data) => {
      setListCourse(data.data || []);
    },
    (error) => {
      api.error({
        message: "Không thể tải danh sách khóa học",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (courseData) {
      setListCourse(courseData.data || []);
      console.log("Course Data:", courseData);
    }
  }, [courseData]);

  // Hook lấy danh sách bài học
  const { data: lessonData, isLoading: isLoadingLesson, refetch } = useGetLesson(
    currentPage,
    pageSize,
    (data) => {
      setListLesson(data.data || []);
    },
    (error) => {
      api.error({
        message: "Không thể tải danh sách bài học",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (lessonData) {
      setListLesson(lessonData.data || []);
      console.log("Lesson Data:", lessonData);
    }
  }, [lessonData]);

  // Hook xóa bài học
  const { mutate: deleteLesson } = useDeleteLesson(
    () => {
      api.success({
        message: "Xóa thành công",
        description: "Bài giảng đã được xóa thành công!",
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

  // Hook cập nhật bài học
  const { mutate: updateLesson, isLoading: isUpdating } = useUpdateLesson(
    () => {
      api.success({
        message: "Cập nhật thành công",
        description: "Bài giảng đã được cập nhật!",
      });
      setIsEditModalOpen(false);
      refetch();
    },
    (error) =>
      api.error({ message: "Cập nhật thất bại", description: error.message })
  );

  // Hook cập nhật khóa học
  const { mutate: updateCourse } = useUpdateCourses();

  const handleEditLesson = (lesson) => {
    console.log("Lesson:", lesson);
    const initialCourseId = lesson.courseId?._id || lesson.courseId || lesson.course?._id || lesson.course;
    setOldCourseId(initialCourseId);
    console.log("Initial Old Course ID:", initialCourseId);

    form.setFieldsValue({
      title: lesson.title,
      content: lesson.content,
      course: initialCourseId,
    });

    setResources(lesson.resources || []);
    setFileList(
      (lesson.resources || []).map((url, index) => ({
        uid: index,
        name: `Video ${index + 1}`,
        status: "done",
        url,
      }))
    );

    setIsEditModalOpen(true);
    setSelectedLesson(lesson); // Đảm bảo gán selectedLesson
  };

  const handleUploadVideo = async (file) => {
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await axios.post("http://localhost:4000/api/v1/upload/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.videoUrl;
    } catch (error) {
      console.error("Lỗi upload video:", error);
      message.error("Tải video lên thất bại!");
      return null;
    }
  };

  const handleResourceChange = async (file) => {
    if (!file || !file.type || !file.type.startsWith("video/")) {
      message.error("Vui lòng chỉ upload file video!");
      return;
    }

    const videoUrl = await handleUploadVideo(file);
    if (videoUrl) {
      setResources((prev) => [...prev, videoUrl]);
      setFileList((prev) => [
        ...prev,
        {
          uid: prev.length,
          name: file.name,
          status: "done",
          url: videoUrl,
        },
      ]);
    }
  };

  const handleUpdateLesson = () => {
    if (!selectedLesson || !selectedLesson._id) { // Kiểm tra _id thay vì id
      api.error({
        message: "Lỗi dữ liệu",
        description: "Bài giảng không được chọn hoặc thiếu ID.",
      });
      return;
    }

    form.validateFields().then((values) => {
      console.log("Form values:", values);

      const updatedLesson = {
        title: values.title,
        content: values.content,
        resources: resources,
        courseId: values.course,
      };
      console.log("Updated Lesson:", updatedLesson);

      console.log("Selected Lesson:", selectedLesson);

      updateLesson(
        { id: selectedLesson._id, payload: updatedLesson }, // Sử dụng _id
        {
          onSuccess: async () => {
            try {
              await refetchCourses();
              console.log("Refreshed listCourse:", listCourse);

              const newCourseId = values.course;

              console.log("Old Course ID (from state):", oldCourseId);
              console.log("New Course ID:", newCourseId);
              console.log("Selected Lesson ID:", selectedLesson._id);

              if (oldCourseId && oldCourseId !== newCourseId) {
                const oldCourseIdStr = oldCourseId.toString();

                const oldCourse = listCourse.find((course) => {
                  const courseIdStr = course._id.toString();
                  console.log(
                    `Comparing course._id: ${courseIdStr} with oldCourseId: ${oldCourseIdStr}`
                  );
                  return courseIdStr === oldCourseIdStr;
                });

                if (!oldCourse) {
                  console.warn("Old course not found in listCourse:", oldCourseId);
                  return;
                }

                console.log("Old Course:", oldCourse);

                const oldLessons = Array.isArray(oldCourse?.lessons)
                  ? oldCourse.lessons
                  : [];
                console.log("Old Lessons before update:", oldLessons);

                const lessonExistsInOldCourse = oldLessons.some((lesson) => {
                  const lessonId = typeof lesson === "object" && lesson._id ? lesson._id : lesson;
                  return lessonId.toString() === selectedLesson._id;
                });

                if (!lessonExistsInOldCourse) {
                  console.warn(
                    "Lesson ID not found in old course lessons:",
                    selectedLesson._id
                  );
                  console.log("Skipping removal as lesson is not in old course.");
                } else {
                  const updatedOldLessons = oldLessons
                    .filter((lesson) => {
                      const lessonId = typeof lesson === "object" && lesson._id ? lesson._id : lesson;
                      return lessonId.toString() !== selectedLesson._id;
                    })
                    .map((lesson) => {
                      return typeof lesson === "object" && lesson._id ? lesson._id : lesson;
                    });

                  console.log("Updated Old Lessons:", updatedOldLessons);

                  await updateCourse(
                    {
                      id: oldCourseId,
                      payload: { lessons: updatedOldLessons },
                    },
                    {
                      onSuccess: () => {
                        console.log("Successfully removed lesson from old course:", oldCourseId);
                      },
                      onError: (error) => {
                        console.error("Error removing lesson from old course:", error);
                        api.error({
                          message: "Không thể xóa bài giảng khỏi khóa học cũ",
                          description: error.message,
                        });
                      },
                    }
                  );
                }
              } else {
                console.log("No need to remove lesson from old course (same course or no old course).");
              }

              const newCourse = listCourse.find(
                (course) => course._id.toString() === newCourseId.toString()
              );
              if (!newCourse) {
                console.warn("New course not found in listCourse:", newCourseId);
                return;
              }

              const newLessons = Array.isArray(newCourse?.lessons)
                ? newCourse.lessons
                : [];
              const updatedNewLessons = [...newLessons, selectedLesson._id].filter(
                (id, index, self) => self.indexOf(id) === index
              );

              console.log("New Lessons before update:", newLessons);
              console.log("Updated New Lessons:", updatedNewLessons);

              await updateCourse(
                {
                  id: newCourseId,
                  payload: { lessons: updatedNewLessons },
                },
                {
                  onSuccess: () => {
                    console.log("Successfully added lesson to new course:", newCourseId);
                  },
                  onError: (error) => {
                    console.error("Error adding lesson to new course:", error);
                    api.error({
                      message: "Không thể thêm bài giảng vào khóa học mới",
                      description: error.message,
                    });
                  },
                }
              );

              await refetch();
              await refetchCourses();

              api.success({ message: "Cập nhật bài giảng và khóa học thành công" });
              setIsEditModalOpen(false);
            } catch (error) {
              console.error("Error during course update:", error);
              api.error({
                message: "Có lỗi xảy ra khi cập nhật khóa học",
                description: error.message,
              });
            }
          },
          onError: (error) => {
            console.error("Error updating lesson:", error);
            api.error({
              message: "Cập nhật bài giảng thất bại",
              description: error.message,
            });
          },
        }
      );
    });
  };

  const handleDelete = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa bài giảng này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        deleteLesson(id);
      },
    });
  };

  const columns = [
    {
      title: "Tiêu đề bài giảng",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Nội dung bài giảng",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Tài liệu bài giảng",
      dataIndex: "resources",
      key: "resources",
      render: (resources) => (resources && resources.length > 0 ? "Có tài liệu" : "Không có"),
    },
    {
      title: "Khóa học liên quan",
      key: "course",
      dataIndex: "courseId",
      render: (courseId) => (courseId?.title ? courseId.title : "Chưa có khóa học"),
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
              onClick={() => handleEditLesson(record)}
              style={{ backgroundColor: "#1890ff", color: "white", border: "none", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#40a9ff"; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1890ff"; e.currentTarget.style.transform = "scale(1)"; }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
              style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ff7875"; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ff4d4f"; e.currentTarget.style.transform = "scale(1)"; }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tableStyle = {
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "white", minHeight: "100px" }}>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <h1 style={{ color: "black", fontSize: "20px" }}>Danh sách bài giảng</h1>
      </div>
      <div style={{ maxHeight: "500px", overflow: "auto" }}>
        <Table
          columns={columns}
          dataSource={listLesson.map((lesson) => ({
            _id: lesson._id,
            title: lesson.title,
            content: lesson.content,
            resources: lesson.resources,
            courseId: lesson.courseId,
          }))}
          loading={isLoadingLesson}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: lessonData?.pagination?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} bài giảng`,
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

      <Modal
        title="Cập nhật bài giảng"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdateLesson}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isUpdating}
        width={800}
        style={{ top: "20px" }}
        bodyStyle={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}
        okButtonProps={{ style: { backgroundColor: "#1890ff", borderColor: "#1890ff", borderRadius: "4px", padding: "5px 15px" } }}
        cancelButtonProps={{ style: { borderRadius: "4px", padding: "5px 15px" } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tên bài giảng"
            rules={[{ required: true, message: "Vui lòng nhập tên bài giảng!" }]}
          >
            <Input
              style={{ borderRadius: "4px", padding: "8px", borderColor: "#d9d9d9" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1890ff"; e.currentTarget.style.boxShadow = "0 0 5px #1890ff"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </Form.Item>
          <Form.Item name="content" label="Nội dung bài giảng">
            <Input
              style={{ borderRadius: "4px", padding: "8px", borderColor: "#d9d9d9" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1890ff"; e.currentTarget.style.boxShadow = "0 0 5px #1890ff"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </Form.Item>
          <Form.Item label="Tài liệu bài giảng (Chỉ video)">
            <Dragger
              multiple={false}
              beforeUpload={(file) => {
                handleResourceChange(file);
                return false;
              }}
              fileList={fileList}
              showUploadList={{
                showRemoveIcon: true,
                removeIcon: <Button danger>Xóa</Button>,
              }}
              onRemove={(file) => {
                setResources(resources.filter((url) => url !== file.url));
                setFileList(fileList.filter((item) => item.uid !== file.uid));
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Kéo thả video vào đây hoặc bấm để chọn file</p>
              <p className="ant-upload-hint">Chỉ hỗ trợ file video.</p>
            </Dragger>
          </Form.Item>
          <Form.Item
            name="course"
            label="Khóa học liên quan"
            rules={[{ required: true, message: "Vui lòng chọn khóa học!" }]}
          >
            <Select
              size="large"
              placeholder="Chọn khóa học"
              value={selectCourse}
              onChange={(value) => setSelectCourse(value)}
              style={{ width: "100%", borderRadius: "4px" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1890ff"; e.currentTarget.style.boxShadow = "0 0 5px #1890ff"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {listCourse?.map((course) => (
                <Select.Option key={course._id} value={course._id}>
                  {course.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageLesson;