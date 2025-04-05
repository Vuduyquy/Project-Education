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
  List,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useGetExams,
  useDeleteExam,
  usePutExam,
} from "../../../apis/createExam.api";
import { useGetCategory } from "../../../apis/categories.api";
import { useDeleteLesson, useGetLesson, useUpdateLesson } from "../../../apis/lessons.api";
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

  //Hook lấy danh sách bài học
  const { data: courseData, refetch: refetchCourses } = useGetCourses(
    (data) => {
      //console.log("Lesson Data:", data);
      setListCourse(data.data); // Đảm bảo cập nhật đúng dữ liệu
    },
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );

  // // Cập nhật danh mục khi `lessonData` thay đổi
  useEffect(() => {
    if (courseData) {
      console.log("Updating listLesson with:", courseData.data);
      setListCourse(courseData?.data);
    }
  }, [courseData]);
  console.log("Dữ liệu courseData:", courseData);

  // Hook để lấy danh sách đề thi
  const {
    data: lessonData,
    isLoading: isLoadingCategory,
    refetch,
  } = useGetLesson(
    (data) => {
      setListLesson(data.data); // Đảm bảo cập nhật đúng dữ liệu
    },
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (lessonData) {
      setListLesson(lessonData?.data?.data);
    }
  }, [lessonData]);
  console.log("lessonData:", lessonData);

  //Hook để xóa bài giảng
  const { mutate: deleteLesson } = useDeleteLesson(
    () => {
      api.success({
        message: "Xóa thành công",
        description: "bài giảng đã được xóa thành công!",
      });
      refetch(); // Tải lại danh sách sau khi xóa
    },
    (error) => {
      api.error({
        message: "Không thể xóa",
        description: error.message,
      });
    }
  );

  // Hook cập nhật bài thi
  const { mutate: updateLesson, isLoading: isUpdating } = useUpdateLesson(
    () => {
      api.success({
        message: "Cập nhật thành công",
        description: "bài thi đã được cập nhật!",
      });
      setIsEditModalOpen(false);
      refetch();
    },
    (error) =>
      api.error({ message: "Cập nhật thất bại", description: error.message })
  );

  const handleEditLesson = (lesson) => {
    console.log('leson:', lesson);
    setSelectedLesson(lesson);
    // Lưu oldCourseId ban đầu
  const initialCourseId = lesson.courseId?._id || lesson.courseId || lesson.course?._id || lesson.course;
  setOldCourseId(initialCourseId);
  console.log("Initial Old Course ID:", initialCourseId);
    form.setFieldsValue({
      title: lesson.name,
      content: lesson.content,
      course: initialCourseId,
    });

    setResources(lesson.resources || []);
    setFileList(
      lesson.resources?.map((url, index) => ({
        uid: index,
        name: `Video ${index + 1}`,
        status: "done",
        url,
      })) || []
    );

    setIsEditModalOpen(true);
  };

  const handleUploadVideo = async (file) => {
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await axios.post("http://localhost:4000/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.videoUrl; // Lấy URL video từ API
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

  const { mutate: updateCourse } = useUpdateCourses();

  const handleUpdateLesson = () => {
    form.validateFields().then((values) => {
      console.log("Form values:", values);
  
      const updatedLesson = {
        title: values.title,
        content: values.content,
        resources: resources,
        courseId: values.course,
      };
      console.log("Updated Lesson:", updatedLesson);
  
      // Log selectedLesson để kiểm tra
      console.log("Selected Lesson:", selectedLesson);
  
      // Cập nhật bài giảng với khóa học mới
      updateLesson(
        { id: selectedLesson.id, payload: updatedLesson },
        {
          onSuccess: async () => {
            try {
              // Làm mới danh sách khóa học trước khi thực hiện logic
              await refetchCourses();
              console.log("Refreshed listCourse:", listCourse);
  
              // 1. Xóa bài giảng khỏi khóa học cũ (nếu có thay đổi khóa học)
              const newCourseId = values.course; // ID khóa học mới
  
              console.log("Old Course ID (from state):", oldCourseId);
              console.log("New Course ID:", newCourseId);
              console.log("Selected Lesson ID:", selectedLesson.id);
  
              if (oldCourseId && oldCourseId !== newCourseId) {
                // Chuẩn hóa oldCourseId thành chuỗi
                const oldCourseIdStr = oldCourseId.toString();
  
                // Tìm khóa học cũ trong listCourse
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
  
                // Log oldCourse để kiểm tra
                console.log("Old Course:", oldCourse);
  
                // Lấy danh sách lessons của khóa học cũ
                const oldLessons = Array.isArray(oldCourse?.lessons)
                  ? oldCourse.lessons
                  : [];
                console.log("Old Lessons before update:", oldLessons);
  
                // Kiểm tra xem lessonId có trong oldLessons không
                const lessonExistsInOldCourse = oldLessons.some((lesson) => {
                  // Nếu lesson là đối tượng, lấy _id; nếu là chuỗi, sử dụng trực tiếp
                  const lessonId = typeof lesson === 'object' && lesson._id ? lesson._id : lesson;
                  return lessonId.toString() === selectedLesson.id;
                });
  
                if (!lessonExistsInOldCourse) {
                  console.warn(
                    "Lesson ID not found in old course lessons:",
                    selectedLesson.id
                  );
                  console.log("Skipping removal as lesson is not in old course.");
                } else {
                  // Lọc bài giảng ra khỏi danh sách lessons của khóa học cũ
                  const updatedOldLessons = oldLessons
                    .filter((lesson) => {
                      const lessonId = typeof lesson === 'object' && lesson._id ? lesson._id : lesson;
                      return lessonId.toString() !== selectedLesson.id;
                    })
                    .map((lesson) => {
                      // Nếu lesson là đối tượng, chỉ giữ lại _id; nếu là chuỗi, giữ nguyên
                      return typeof lesson === 'object' && lesson._id ? lesson._id : lesson;
                    });
  
                  console.log("Updated Old Lessons:", updatedOldLessons);
  
                  // Cập nhật khóa học cũ (xóa lessonId)
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
  
              // 2. Thêm bài giảng vào khóa học mới
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
              const updatedNewLessons = [...newLessons, selectedLesson.id].filter(
                (id, index, self) => self.indexOf(id) === index // Loại bỏ trùng lặp
              );
  
              console.log("New Lessons before update:", newLessons);
              console.log("Updated New Lessons:", updatedNewLessons);
  
              // Cập nhật khóa học mới (thêm lessonId)
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
  
              // Làm mới dữ liệu
              await refetch(); // Làm mới danh sách bài giảng
              await refetchCourses(); // Làm mới danh sách khóa học
  
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
  
  


  // const handleUpdateLesson = () => {
  //   form.validateFields().then((values) => {
  //     const updatedLesson = {
  //       title: values.title,
  //       content: values.content,
  //       resources: resources,
  //       courseId: values.course,
  //     };
  //     updateLesson({ id: selectedLesson.id, payload: updatedLesson });
  //   });
  // };


  //Hàm xóa bài giảng với xác nhận
  const handleDelete = (id) => {
  console.log('key:', id)
    confirm({
      title: "Bạn có chắc chắn muốn xóa bài giảng này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        deleteLesson(id); // Gọi API xóa bài giảng
      },
    });
  };


  const columns = [
    {
      title: "Tiêu đề bài giảng",
      dataIndex: "name",
      key: "name",
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
},
    {
      title: "Khoá học liên quan",
      key: "course",
      dataIndex: "course",
      //render: (courses) => courses?.map((course) => course.title).join(", ") || "Chưa có khóa học",
      render: (course) => (course?.title ? course.title : "Chưa có khóa học"),
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
            />
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
        <h1>Danh sách đề thi </h1>
      </div>
      <Table
        columns={columns}
        dataSource={listLesson.map((lesson) => ({
          id: lesson._id, // Dùng _id làm khóa chính
          name: lesson.title,
          content: lesson.content,
          resources: lesson.resources,
          course: lesson.courseId,
          // questionCount: exam.questions,
        }))}
        loading={isLoadingCategory}
      />

      <Modal
        title="Cập nhật khóa học"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdateLesson}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isUpdating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tên bài giảng"
            //rules={[{ required: true, message: "Vui lòng nhập tên đề thi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung bài giảng">
            <Input />
          </Form.Item>
          <Form.Item label="Tài liệu bài giảng (Chỉ video)">
            <Upload.Dragger
              multiple={false}
              beforeUpload={(file) => {
                handleResourceChange(file);
                return false;
              }}
              fileList={fileList}
              showUploadList={{
                showRemoveIcon: true,
                removeIcon: <Button danger>Xoá</Button>,
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
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="course" label="Khoá học liên quan">
          <Select
              size="large"
              //mode="multiple"
              placeholder="Chọn khóa học"
              value={selectCourse}
              onChange={(value) => setSelectCourse(value)}
              loading={isLoadingCategory}
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
