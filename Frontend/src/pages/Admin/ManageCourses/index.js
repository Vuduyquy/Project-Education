

import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Table,
  Tooltip,
  notification,
  Modal,
  Image,
  Form,
  Input,
  Select,
  Upload
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  useDeleteCourses,
  useGetCourses,
  useUpdateCourses,
} from "../../../apis/courses.api";
import { useGetLesson, useUpdateLesson } from "../../../apis/lessons.api"; // Thêm hook lấy bài học

const ManageCourses = () => {
  const [listCourses, setListCourses] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const { confirm } = Modal;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [listLesson, setListLesson] = useState([]);
  const [selectLesson, setSelectLesson] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  // Hook lấy danh sách khóa học
  const {
    data: courseData,
    isLoading: isLoadingCourses,
    refetch,
  } = useGetCourses(
    (data) => setListCourses(data),
    (error) =>
      api.error({
        message: "Không thể tải danh sách khóa học",
        description: error.message,
      })
  );

  // Hook lấy danh sách bài học
  const { data: lessonData, isLoading: isLoadingCategory } = useGetLesson(
    (data) => {
      console.log("Lesson Data:", data);
      setListLesson(data.data); // Đảm bảo cập nhật đúng dữ liệu
    },
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );

  // Cập nhật danh mục khi `lessonData` thay đổi
  useEffect(() => {
    if (lessonData) {
      console.log("Updating listLesson with:", lessonData.data.data);
      setListLesson(lessonData?.data.data);
    }
  }, [lessonData]);
  console.log("Dữ liệu lessonData:", lessonData);

  // Hook cập nhật khóa học
  const { mutate: updateCourses, isLoading: isUpdating } = useUpdateCourses(
    () => {
      api.success({
        message: "Cập nhật thành công",
        description: "Khóa học đã được cập nhật!",
      });
      setIsEditModalOpen(false);
      refetch();
    },
    (error) =>
      api.error({ message: "Cập nhật thất bại", description: error.message })
  );

  // Hook xóa khóa học
  const { mutate: deleteCourses } = useDeleteCourses(
    () => {
      api.success({
        message: "Xóa thành công",
        description: "Khoá học đã bị xóa!",
      });
      refetch();
    },
    (error) =>
      api.error({ message: "Không thể xóa", description: error.message })
  );

  const handleEditCourses = (course) => {
    console.log('course:', course)
    setSelectedCourse(course);

    const existingFiles = course.resources.map((resource, index) => ({
      uid: `existing-${index}`,
      name: `Tài liệu ${index + 1}`,
      url: resource,
    }));

    setFileList(existingFiles);
    
    form.setFieldsValue({
      title: course.name,
      category: course.category,
      lessons: course.lessons.map((lesson) => lesson._id),
      instructorId: course.instructorId,
      users: course.users.length,
    });

    setSelectLesson(course.lessons.map((lesson) => lesson._id));
    setIsEditModalOpen(true);
  };

  const { mutate: updateLesson } = useUpdateLesson();
  const handleUpdateCourse = () => {
    form.validateFields().then((values) => {
      const updatedCourse = {
        title: values.title,
        category: values.category,
        lessons: values.lessons.map((lessonId) => ({ _id: lessonId })),
        resources: [
          ...fileList.filter((file) => file.url).map((file) => file.url),
          ...fileList
            .filter((file) => file.originFileObj)
            .map((file) => URL.createObjectURL(file.originFileObj)),
        ],
      };
  
      // Lấy danh sách bài giảng cũ
      const previousLessons = selectedCourse.lessons || [];
      const newLessons = values.lessons || [];
  
      // Tìm các bài giảng đã bị xóa (không còn trong danh sách mới)
      const removedLessons = previousLessons.filter(
        (lesson) => !newLessons.includes(lesson._id)
      );
  
      // Tìm các bài giảng mới được thêm vào
      const addedLessons = newLessons.filter(
        (lessonId) =>
          !previousLessons.some((prevLesson) => prevLesson._id === lessonId)
      );
  
      // Cập nhật khoá học
      updateCourses({ id: selectedCourse.id, payload: updatedCourse });
  
      // Gỡ bỏ khoá học khỏi các bài giảng đã bị xoá
      removedLessons.forEach((lesson) => {
        updateLesson({ id: lesson._id, payload:  { courseId: selectedCourse.id } });
      });
  
      // Thêm khoá học vào các bài giảng mới
      addedLessons.forEach((lessonId) => {
        updateLesson({ id: lessonId, payload:  { courseId: selectedCourse.id } });
      });
  
      api.success({ message: "Cập nhật khoá học và bài giảng thành công" });
    });
  };
  


  // const handleUpdateCourse = () => {
  //   form.validateFields().then((values) => {
  //     const updatedCourse = {
  //       title: values.title,
  //       category: values.category,
  //       //lessons: values.lessons,
  //       lessons: values.lessons.map((lessonId) => ({ _id: lessonId })),
  //       resources: [
  //         ...fileList.filter((file) => file.url).map((file) => file.url),
  //         ...fileList.filter((file) => file.originFileObj).map((file) => URL.createObjectURL(file.originFileObj)),
  //       ],
  //     };
  //     updateCourses({ id: selectedCourse.id, payload: updatedCourse });
      
  //   });
  // };

  // Xóa khóa học với xác nhận
  const handleDeleteCourses = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa khoá học này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteCourses(id),
    });
  };

  useEffect(() => {
    if (courseData) setListCourses(courseData?.data);
  }, [courseData]);

  const columns = [
    { title: "Tên khoá học", dataIndex: "name", key: "name" },
    {
      title: "Người tạo khoá học",
      dataIndex: "instructorId",
      key: "instructorId",
    },
    { title: "Danh mục khoá học", dataIndex: "category", key: "category" },
    {
      title: "Số bài học",
      dataIndex: "lessons",
      key: "lessons",
      render: (lessons) => lessons?.map((lesson) => lesson.title).join(", ") || "",
      //render: (lessons) => lessons.map((l) => l.title).join(", "),
    },
    {
      title: "Tài liệu tham khảo",
      dataIndex: "resources",
      key: "resources",
      render: (resources) =>
        resources.length === 0 ? (
          "Không có tài liệu"
        ) : (
          <Space direction="vertical">
            {resources.map((resource, index) =>
              resource.startsWith("data:image/") ? (
                <Image
                  key={index}
                  width={50}
                  src={resource}
                  alt={`resource-${index}`}
                />
              ) : (
                <a key={index} href={resource} download={`resource-${index}`}>
                  Tải tài liệu {index + 1}
                </a>
              )
            )}
          </Space>
        ),
    },
    {
      title: "Số người tham gia",
      dataIndex: "users",
      key: "users",
      render: (users) => users.length,
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
              onClick={() => handleEditCourses(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCourses(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <h1>Danh sách khoá học</h1>
      <div style={{ maxHeight: "500px", overflow: "auto" }}>
      <Table
        columns={columns}
        dataSource={listCourses?.map((course) => ({
          key: course._id,
          id: course._id,
          name: course.title,
          instructorId: course.instructorId?.fullName,
          category: course.category,
          lessons: course.lessons,
          users: course.users,
          resources: course.resources,
        }))}
        loading={isLoadingCourses}
      />
      </div>

      {/* Modal cập nhật khóa học */}
      <Modal
        title="Cập nhật khóa học"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdateCourse}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isUpdating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tên khóa học"
            rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Danh mục">
            <Input />
          </Form.Item>
          <Form.Item name="lessons" label="Bài học">
            <Select
              size="large"
              mode="multiple"
              placeholder="Chọn list bài giảng liên quan"
              value={selectLesson}
              onChange={(value) => setSelectLesson(value)}
              loading={isLoadingCategory}
            >
              {listLesson?.map((lesson) => (
                <Select.Option key={lesson._id} value={lesson._id}>
                  {lesson.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="resources" label="Tài liệu tham khảo">
          <Upload.Dragger fileList={fileList} onChange={({ fileList }) => setFileList(fileList)} beforeUpload={() => false} multiple>
              <p className="ant-upload-drag-icon"> <UploadOutlined /> </p>
              <p>Kéo thả hoặc nhấp để tải lên</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="instructorId" label="Người tạo khóa học">
            <Input disabled />
          </Form.Item>
          <Form.Item name="users" label="Số người tham gia">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCourses;
