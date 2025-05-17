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
  Upload,
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
import { useGetLesson, useUpdateLesson } from "../../../apis/lessons.api";

const ManageCourses = () => {
  const [api, contextHolder] = notification.useNotification();
  const { confirm } = Modal;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [listLesson, setListLesson] = useState([]);
  const [selectLesson, setSelectLesson] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Hàm chuyển file thành chuỗi Base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    //console.log("token:", token);
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1];
      //console.log("payloadBase64", payloadBase64);
      const payload = JSON.parse(atob(payloadBase64));
      //console.log("payload", payload);
      return payload?._id || null;
    } catch (error) {
      //console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();
   console.log("userId:", userId);

  

  // Hook lấy danh sách khóa học với phân trang
  const {
    data: courseData,
    isLoading: isLoadingCourses,
    refetch,
  } = useGetCourses(
    currentPage,
    pageSize,
    (data) => {
      console.log("Received course data in onSuccess:", data);
    },
    (error) =>
      api.error({
        message: "Không thể tải danh sách khóa học",
        description: error.message,
      })
  );

  useEffect(() => {
    console.log("Course data updated:", courseData);
  }, [courseData]);
  console.log("Course data:", courseData);

  useEffect(() => {
    console.log("Current page changed to:", currentPage);
    refetch();
  }, [currentPage, refetch]);

  // Hook lấy danh sách bài học
  const { data: lessonData, isLoading: isLoadingCategory } = useGetLesson(
    (data) => {
      console.log("Lesson Data:", data);
      setListLesson(data.data || []);
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
      console.log("Updating listLesson with:", lessonData.data.data);
      setListLesson(lessonData?.data.data || []);
    }
  }, [lessonData]);

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
    setSelectedCourse(course);
    const existingFiles = course.resources.map((resource, index) => ({
      uid: `existing-${index}`,
      name: `Tài liệu ${index + 1}`,
      url: resource,
      status: "done",
    }));
    setFileList(existingFiles);

    // Xử lý hình ảnh khóa học
    const existingImage = course.image
      ? [
          {
            uid: "image-1",
            name: "Hình ảnh khóa học",
            url: course.image,
            status: "done",
          },
        ]
      : [];
    setImageFileList(existingImage);

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

  const handleUpdateCourse = async () => {
    try {
      const values = await form.validateFields();
      let imageBase64 = null;

      // Chuyển đổi hình ảnh thành chuỗi Base64 nếu có file mới
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        imageBase64 = await getBase64(imageFileList[0].originFileObj);
      } else if (imageFileList.length > 0) {
        // Giữ nguyên URL nếu không có file mới
        imageBase64 = imageFileList[0].url;
      }

      const updatedCourse = {
        title: values.title,
        category: values.category,
        lessons: values.lessons.map((lessonId) => ({ _id: lessonId })),
        resources: await Promise.all(
          fileList.map(async (file) => {
            if (file.url) {
              return file.url; // Giữ nguyên nếu đã có URL
            }
            return await getBase64(file.originFileObj); // Chuyển đổi file mới thành Base64
          })
        ),
        image: imageBase64, // Sử dụng chuỗi Base64 hoặc URL
      };

      const previousLessons = selectedCourse.lessons || [];
      const newLessons = values.lessons || [];
      const removedLessons = previousLessons.filter(
        (lesson) => !newLessons.includes(lesson._id)
      );
      const addedLessons = newLessons.filter(
        (lessonId) =>
          !previousLessons.some((prevLesson) => prevLesson._id === lessonId)
      );

      updateCourses({ id: selectedCourse.id, payload: updatedCourse });
      removedLessons.forEach((lesson) => {
        updateLesson({ id: lesson._id, payload: { courseId: selectedCourse.id } });
      });
      addedLessons.forEach((lessonId) => {
        updateLesson({ id: lessonId, payload: { courseId: selectedCourse.id } });
      });

      api.success({ message: "Cập nhật khóa học và bài giảng thành công" });
    } catch (error) {
      api.error({
        message: "Cập nhật thất bại",
        description: error.message || "Vui lòng kiểm tra lại thông tin.",
      });
    }
  };

  const handleDeleteCourses = (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa khóa học này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteCourses(id),
    });
  };

  const handlePageChange = (page) => {
    console.log("Changing to page:", page);
    setCurrentPage(page);
  };

  const columns = [
    { title: "Tên khóa học", dataIndex: "name", key: "name" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <Image
            width={50}
            height={50}
            src={image}
            alt="course-image"
            style={{ objectFit: "cover", borderRadius: "4px" }}
            preview={{
              mask: "Xem ảnh",
              maskStyle: { color: "#1890ff" },
            }}
            onError={(e) => {
              e.target.src = "https://www.nait.vn/uploads/news/2023/02/1_9.jpg";
              e.target.alt = "Hình ảnh không khả dụng";
            }}
          />
        ) : (
          <span style={{ color: "#999" }}>Không có hình ảnh</span>
        ),
    },
    {
      title: "Người tạo khóa học",
      dataIndex: "instructorId",
      key: "instructorId",
      render: (instructorId) => instructorId?.fullName || "Chưa có thông tin",
    },
    { title: "Danh mục khóa học", dataIndex: "category", key: "category" },
    {
      title: "Số bài học",
      dataIndex: "lessons",
      key: "lessons",
      render: (lessons) => lessons?.map((lesson) => lesson.title).join(", ") || "",
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
                  height={50}
                  src={resource}
                  alt={`resource-${index}`}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                  preview={{
                    mask: "Xem ảnh",
                    maskStyle: { color: "#1890ff" },
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/50?text=Error";
                    e.target.alt = "Tài liệu không khả dụng";
                  }}
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
      render: (_, record) => {
        const isDisabled =  record.instructorId._id !== userId;
        return (
          <Space size="middle">
            <Tooltip title={isDisabled ? "Bạn không có quyền chỉnh sửa" : "Chỉnh sửa"}>
              <Button
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => !isDisabled && handleEditCourses(record)}
                disabled={isDisabled}
                style={{
                  backgroundColor: isDisabled ? "#d9d9d9" : "#1890ff",
                  color: "white",
                  border: "none",
                  transition: "all 0.3s",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = "#40a9ff";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = "#1890ff";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              />
            </Tooltip>
            <Tooltip title={isDisabled ? "Bạn không có quyền xóa" : "Xóa"}>
              <Button
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => !isDisabled && handleDeleteCourses(record.id)}
                disabled={isDisabled}
                style={{
                  backgroundColor: isDisabled ? "#d9d9d9" : "#ff4d4f",
                  color: "white",
                  border: "none",
                  transition: "all 0.3s",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = "#ff7875";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = "#ff4d4f";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const tableData = (courseData?.data || []).map((course) => ({
    key: course._id,
    id: course._id,
    name: course.title,
    image: course.image,
    instructorId: course.instructorId,
    category: course.category,
    lessons: course.lessons,
    users: course.users,
    resources: course.resources,
  }));
  

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
        Danh sách khóa học
      </h1>
      <div style={{ maxHeight: "500px", overflow: "auto" }}>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoadingCourses}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: courseData?.pagination?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} khóa học`,
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
                    trước
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

      <Modal
        title="Cập nhật khóa học"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdateCourse}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isUpdating}
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
          <Form.Item
            name="title"
            label="Tên khóa học"
            rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
          >
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
          <Form.Item name="category" label="Danh mục">
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
          <Form.Item name="image" label="Hình ảnh khóa học">
            <Upload
              fileList={imageFileList}
              onChange={({ fileList }) => setImageFileList(fileList)}
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
              accept="image/*"
              style={{
                borderRadius: "4px",
                padding: "10px",
                border: "1px dashed #d9d9d9",
                backgroundColor: "#fafafa",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#1890ff";
                e.currentTarget.style.cursor = "pointer";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d9d9d9";
              }}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="lessons" label="Bài học">
            <Select
              disabled
              size="large"
              mode="multiple"
              placeholder="Chọn list bài giảng liên quan"
              value={selectLesson}
              onChange={(value) => setSelectLesson(value)}
              loading={isLoadingCategory}
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
              {listLesson?.map((lesson) => (
                <Select.Option key={lesson._id} value={lesson._id}>
                  {lesson.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="resources" label="Tài liệu tham khảo">
            <Upload.Dragger
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              multiple
              style={{
                borderRadius: "4px",
                padding: "10px",
                border: "1px dashed #d9d9d9",
                backgroundColor: "#fafafa",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#1890ff";
                e.currentTarget.style.cursor = "pointer";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d9d9d9";
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p>Kéo thả hoặc nhấp để tải lên</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="instructorId" label="Người tạo khóa học">
            <Input
              disabled
              style={{
                borderRadius: "4px",
                padding: "8px",
                borderColor: "#d9d9d9",
                backgroundColor: "#f0f0f0",
              }}
            />
          </Form.Item>
          <Form.Item name="users" label="Số người tham gia">
            <Input
              disabled
              style={{
                borderRadius: "4px",
                padding: "8px",
                borderColor: "#d9d9d9",
                backgroundColor: "#f0f0f0",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCourses;