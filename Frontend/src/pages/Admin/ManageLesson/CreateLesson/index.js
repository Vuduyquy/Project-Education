import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateLesson } from "../../../../apis/lessons.api";
import { useGetCourses, useUpdateCourses } from "../../../../apis/courses.api";
import axios from "axios"; // Thêm axios để gửi request lên server

const CreateLesson = () => {
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resources, setResources] = useState([]); // Chỉ lưu URL
  const [listCourse, setListCourse] = useState([]);
  const [selectCourse, setSelectCourse] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleChangeTitle = (event) =>{
    setTitle(event.target.value);};
  const handleChangeContent = (event) =>
    setContent(event.target.value);

  const handleUploadVideo = async (file) => {
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await axios.post("http://localhost:4000/api/v1/upload/upload", formData, {
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

    // Upload file lên server và lấy URL
    const videoUrl = await handleUploadVideo(file);
    if (videoUrl) {
      setResources((prev) => [...prev, videoUrl]); // Lưu URL vào state
      setFileList([...fileList, file]); // Cập nhật danh sách file đã chọn
    }
  };

  const { data: courseData, isLoading: isLoadingCategory } = useGetCourses(
    (data) => setListCourse(data),
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (courseData) {
      setListCourse(courseData?.data);
    }
  }, [courseData]);

  const handleCloseForm = () => navigate("/admin");

  const { mutate: createLesson } = useCreateLesson();

  // const handleCreateLesson = async () => {
  //   setIsLoading(true);
  //   try {
  //     await createLesson({
  //       title,
  //       content,
  //       resources, // Lưu danh sách URL vào MongoDB
  //       courseId: selectCourse,
  //     });

  //     api.success({ message: "Tạo bài giảng thành công" });
  //     resetForm();
  //   } catch {
  //     api.error({ message: "Tạo bài giảng không thành công" });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const { mutate: updateCourse } = useUpdateCourses();

  const handleCreateLesson = async () => {
    setIsLoading(true);
  
    try {
      // Tạo bài giảng mới
      await createLesson(
        {
          title,
          content,
          resources, // Danh sách URL của tài liệu
          courseId: selectCourse,
        },
        {
          onSuccess: async (createdLesson) => {
            console.log("Created Lesson Response:", createdLesson);
            const lessonId = createdLesson?.data?._id;
  
            if (lessonId) {
              // Tìm khóa học đã chọn từ danh sách khóa học
              const selectedCourse = listCourse.find(
                (course) => course._id === selectCourse
              );
  
              // Lấy danh sách bài giảng hiện tại, nếu không có thì khởi tạo mảng rỗng
              const existingLessons = Array.isArray(selectedCourse?.lessons)
                ? selectedCourse.lessons
                : [];
  
              // Thêm lessonId mới vào danh sách bài giảng
              const updatedLessons = [...existingLessons, lessonId];
  
              // Cập nhật khóa học với danh sách bài giảng mới
              await updateCourse(
                {
                  id: selectCourse,
                  payload: { lessons: updatedLessons },
                },
                {
                  onSuccess: () => {
                    api.success({
                      message: "Tạo bài giảng và cập nhật khoá học thành công",
                    });
                    resetForm();
                  },
                  onError: (error) => {
                    console.error("Lỗi cập nhật khóa học:", error);
                    api.error({
                      message: "Cập nhật khoá học thất bại",
                      description: error.message,
                    });
                  },
                }
              );
            } else {
              api.error({ message: "Không lấy được ID bài giảng từ phản hồi" });
            }
          },
          onError: (error) => {
            console.error("Lỗi tạo bài giảng:", error);
            api.error({
              message: "Tạo bài giảng không thành công",
              description: error.message,
            });
          },
        }
      );
    } catch (error) {
      console.error("Lỗi tổng quát:", error);
      api.error({ message: "Có lỗi xảy ra khi tạo bài giảng" });
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const checkStatusDisabledButtonCreate = () => {
    return !title || !content || resources.length === 0 ;
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setResources([]);
    setFileList([]);
    setSelectCourse(null);
  };

  return (
    <div className="create-exam">
      {contextHolder}
      <h1 style={{ textAlign: "center" }}>Tạo bài giảng</h1>

      <Form name="basic" layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Divider orientation="left">Nội dung bài giảng</Divider>
          </Col>

          <Col span={12}>
            <Form.Item label="Tên bài giảng">
              <Input size="large" value={title} onChange={handleChangeTitle} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Nội dung bài giảng">
              <Input size="large" value={content} onChange={handleChangeContent} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tài liệu học tập (Chỉ video)">
              <Upload.Dragger
                multiple={false} // Chỉ chọn 1 file
                beforeUpload={(file) => {
                  handleResourceChange(file);
                  return false; // Ngăn upload mặc định của antd
                }}
                fileList={fileList}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Kéo thả video vào đây hoặc bấm để chọn file
                </p>
                <p className="ant-upload-hint">Chỉ hỗ trợ file video.</p>
              </Upload.Dragger>
            </Form.Item>

            {/* Hiển thị danh sách video đã chọn */}
            {resources.map((videoUrl, index) => (
              <video key={index} width="300" controls>
                <source src={videoUrl} type="video/mp4" />
                Trình duyệt không hỗ trợ video.
              </video>
            ))}
          </Col>

          <Col span={12}>
            <Form.Item label="Bài giảng của khoá học">
              <Select
                size="large"
                placeholder="Chọn khoá học liên quan"
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
          </Col>
        </Row>

        <Row justify="space-between" style={{ marginTop: "32px" }}>
          <Col>
            <Button danger onClick={handleCloseForm}>
              Đóng lại
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={handleCreateLesson}
              loading={isLoading}
              disabled={checkStatusDisabledButtonCreate()}
            >
              Tạo bài giảng
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateLesson;
