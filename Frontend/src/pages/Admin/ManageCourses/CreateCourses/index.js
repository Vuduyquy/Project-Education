// import { InboxOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Col,
//   Divider,
//   Form,
//   Input,
//   notification,
//   Row,
//   Select,
//   Upload,
//   message,
// } from "antd";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCreateCourses } from "../../../../apis/courses.api";
// import { useGetLesson, useUpdateLesson } from "../../../../apis/lessons.api";

// const CreateCourses = () => {
//   const [api, contextHolder] = notification.useNotification();
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const [title, setTitle] = useState(null);
//   const [description, setDescription] = useState(null);
//   const [resources, setResources] = useState([]);
//   const [image, setImage] = useState(null);
//   const [category, setCategory] = useState(null);
//   const [listLesson, setListLesson] = useState([]);
//   const [selectLesson, setSelectLesson] = useState([]);
//   const [fileList, setFileList] = useState([]);


//   const handleChangeTitle = (event) => setTitle(event.target.value);
//   const handleChangeDescription = (event) => setDescription(event.target.value);
//   const handleChangeCategory = (event) => setCategory(event.target.value);

//   const getBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const handleResourceChange = async ({ fileList }) => {
//     const base64Files = await Promise.all(
//       fileList.map(async (file) => {
//         if (!file.url && !file.preview) {
//           file.preview = await getBase64(file.originFileObj);
//         }
//         return file.preview;
//       })
//     );
  
//     // Cập nhật state resources (thêm vào mảng)
//     setResources((prev) => [...prev, ...base64Files]);
//     setFileList(fileList);
//     //console.log("Resources cập nhật:", base64Files);
//   };

//   const handleImageChange = async ({ fileList }) => {
//     if (fileList.length > 1) {
//       message.error("Chỉ được upload một ảnh cho khóa học!");
//       return;
//     }

//     const base64File = fileList.length > 0 ? await getBase64(fileList[0].originFileObj) : null;
//     setImage(base64File); // Lưu một chuỗi Base64 duy nhất
//     setFileList(fileList);
//   };
  
  
  

//   const { data: lessonData, isLoading: isLoadingCategory } = useGetLesson(
//         (data) => {
//           console.log("Lesson Data:", data);
//           setListLesson(data.data); // Đảm bảo cập nhật đúng dữ liệu
//         },
//         (error) => {
//           api.error({
//             message: "Không thể tải danh mục",
//             description: error.message,
//           });
//         }
//       );
    
//       // Cập nhật danh mục khi `lessonData` thay đổi
//       useEffect(() => {
//         if (lessonData) {
//           console.log("Updating listLesson with:", lessonData.data.data);
//           setListLesson(lessonData?.data.data);
//         }
//       }, [lessonData]);
//       console.log("Dữ liệu lessonData:", lessonData);

//   const handleCloseForm = () => navigate("/admin");

//   const { mutate: createCourses } = useCreateCourses();
//   //const { mutate: updateLesson } = useUpdateLesson();

//   const getUserIdFromToken = () => {
//     const token = localStorage.getItem("token");
//     console.log('token:', token)
//     if (!token) return null;
  
//     try {
//       const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
//       console.log('payloadBase64', payloadBase64)
//       const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
//       console.log('payload', payload)
//       return payload?._id || null;
//     } catch (error) {
//       console.error("Lỗi giải mã token:", error);
//       return null;
//     }
//   };

//   const handleCreateCourse = async () => {
//     setIsLoading(true);

//   const instructorId = getUserIdFromToken(); // Lấy _id từ token
//   if (!instructorId) {
//     api.error({ message: "Không tìm thấy thông tin giảng viên" });
//     setIsLoading(false);
//     return;
//   }

//     try {
//       await createCourses({
//         title,
//         description,
//         resources,
//         category,
//         image,
//         //lessons: selectLesson,
//         instructorId,
//       });
      
//       api.success({ message: "Tạo khoá học thành công" });
//       resetForm();
//     } catch {
//       api.error({ message: "Tạo khoá học không thành công" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const checkStatusDisabledButtonCreate = () => {
//     if (
//       !title ||
//       !description ||
//       !resources ||
//       !image ||
//       !category ||
//       !selectLesson
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   const resetForm = () => {
//     setTitle(null);
//     setDescription(null);
//     setResources([]);
//     setImage(null);
//     setFileList([]);
//     setCategory(null);
//     setSelectLesson([]);
//   };

//   return (
//     <div className="create-exam">
//       {contextHolder}
//       <h1 style={{ textAlign: "center" }}>Tạo khoá học</h1>

//       <Form name="basic" layout="vertical">
//         <Row gutter={[16, 16]}>
//           <Col span={24}>
//             <Divider orientation="left">Nội dung khoá học</Divider>
//           </Col>

//           <Col span={12}>
//             <Form.Item label="Tên khoá học">
//               <Input size="large" value={title} onChange={handleChangeTitle} />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item label="Ảnh khoá học">
//               <Upload.Dragger
//                 //multiple
//                 beforeUpload={() => false}
//                 onChange={handleImageChange}
//                 fileList={fileList} 
//               >
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined />
//                 </p>
//                 <p className="ant-upload-text">
//                   Kéo thả file vào đây hoặc bấm để chọn file
//                 </p>
//                 <p className="ant-upload-hint">Hỗ trợ nhiều loại file.</p>
//               </Upload.Dragger>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item label="Mô tả khoá học">
//               <Input
//                 size="large"
//                 value={description}
//                 onChange={handleChangeDescription}
//               />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item label="Tài liệu học tập">
//               <Upload.Dragger
//                 multiple
//                 beforeUpload={() => false}
//                 onChange={handleResourceChange}
//                 fileList={fileList} 
//               >
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined />
//                 </p>
//                 <p className="ant-upload-text">
//                   Kéo thả file vào đây hoặc bấm để chọn file
//                 </p>
//                 <p className="ant-upload-hint">Hỗ trợ nhiều loại file.</p>
//               </Upload.Dragger>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item label="Khoá học thuộc thể loại">
//               <Input
//                 size="large"
//                 value={category}
//                 onChange={handleChangeCategory}
//               />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             {/* <Form.Item label="Bài giảng">
//               <Select
//                 size="large"
//                 mode="multiple"
//                 placeholder="Chọn list bài giảng liên quan"
//                 value={selectLesson}
//                 onChange={(value) => setSelectLesson(value)}
//                 loading={isLoadingCategory}
//               >
//                 {listLesson?.map((lesson) => (
//                   <Select.Option key={lesson._id} value={lesson._id}>
//                     {lesson.title}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item> */}
//           </Col>
//         </Row>

//         <Row justify="space-between" style={{ marginTop: "32px" }}>
//           <Col>
//             <Button danger onClick={handleCloseForm}>
//               Đóng lại
//             </Button>
//           </Col>
//           <Col>
//             <Button
//               type="primary"
//               onClick={handleCreateCourse}
//               loading={isLoading}
//               disabled={checkStatusDisabledButtonCreate()}
//             >
//               Tạo khoá học
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </div>
//   );
// };

// export default CreateCourses;

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
import { useCreateCourses } from "../../../../apis/courses.api";
import { useGetLesson, useUpdateLesson } from "../../../../apis/lessons.api";

const CreateCourses = () => {
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [resources, setResources] = useState([]);
  const [image, setImage] = useState(null); // Chỉ lưu một chuỗi Base64
  const [category, setCategory] = useState(null);
  const [listLesson, setListLesson] = useState([]);
  const [selectLesson, setSelectLesson] = useState([]);
  const [resourceFileList, setResourceFileList] = useState([]); // File list cho resources
  const [imageFileList, setImageFileList] = useState([]); // File list riêng cho image

  const handleChangeTitle = (event) => setTitle(event.target.value);
  const handleChangeDescription = (event) => setDescription(event.target.value);
  const handleChangeCategory = (event) => setCategory(event.target.value);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Xử lý upload resources (nhiều file)
  const handleResourceChange = async ({ fileList }) => {
    const base64Files = await Promise.all(
      fileList.map(async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        return file.preview;
      })
    );

    setResources(base64Files); // Lưu mảng các chuỗi Base64
    setResourceFileList(fileList);
  };

  // Xử lý upload image (chỉ một file)
  const handleImageChange = async ({ fileList }) => {
    if (fileList.length > 1) {
      message.error("Chỉ được upload một ảnh cho khóa học!");
      return;
    }

    const base64File = fileList.length > 0 ? await getBase64(fileList[0].originFileObj) : null;
    setImage(base64File); // Lưu một chuỗi Base64 duy nhất
    setImageFileList(fileList);
  };

  const { data: lessonData, isLoading: isLoadingCategory } = useGetLesson(
    (data) => {
      console.log("Lesson Data:", data);
      setListLesson(data.data);
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
      setListLesson(lessonData?.data.data);
    }
  }, [lessonData]);
  console.log("Dữ liệu lessonData:", lessonData);

  const handleCloseForm = () => navigate("/admin");

  const { mutate: createCourses } = useCreateCourses();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1];
      console.log("payloadBase64", payloadBase64);
      const payload = JSON.parse(atob(payloadBase64));
      console.log("payload", payload);
      return payload?._id || null;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const handleCreateCourse = async () => {
    setIsLoading(true);

    const instructorId = getUserIdFromToken();
    if (!instructorId) {
      api.error({ message: "Không tìm thấy thông tin giảng viên" });
      setIsLoading(false);
      return;
    }

    try {
      await createCourses({
        title,
        description,
        resources,
        category,
        image, // Gửi một chuỗi Base64 duy nhất
        instructorId,
      });

      api.success({ message: "Tạo khóa học thành công" });
      resetForm();
    } catch {
      api.error({ message: "Tạo khóa học không thành công" });
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatusDisabledButtonCreate = () => {
    return !title || !description || !resources.length || !image || !category;
  };

  const resetForm = () => {
    setTitle(null);
    setDescription(null);
    setResources([]);
    setImage(null);
    setResourceFileList([]);
    setImageFileList([]);
    setCategory(null);
    setSelectLesson([]);
  };

  return (
    <div className="create-exam">
      {contextHolder}
      <h1 style={{ textAlign: "center" }}>Tạo khóa học</h1>

      <Form name="basic" layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Divider orientation="left">Nội dung khóa học</Divider>
          </Col>

          <Col span={12}>
            <Form.Item label="Tên khóa học">
              <Input size="large" value={title} onChange={handleChangeTitle} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Mô tả khóa học">
              <Input
                size="large"
                value={description}
                onChange={handleChangeDescription}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item label="Ảnh khóa học">
              <Upload.Dragger
                beforeUpload={() => false}
                onChange={handleImageChange}
                fileList={imageFileList} // File list riêng cho image
                maxCount={1} // Chỉ cho phép upload 1 file
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Kéo thả file vào đây hoặc bấm để chọn file
                </p>
                <p className="ant-upload-hint">Chỉ hỗ trợ upload một ảnh.</p>
              </Upload.Dragger>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tài liệu học tập">
              <Upload.Dragger
                multiple
                beforeUpload={() => false}
                onChange={handleResourceChange}
                fileList={resourceFileList} // File list riêng cho resources
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Kéo thả file vào đây hoặc bấm để chọn file
                </p>
                <p className="ant-upload-hint">Hỗ trợ nhiều loại file.</p>
              </Upload.Dragger>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Khóa học thuộc thể loại">
              <Input
                size="large"
                value={category}
                onChange={handleChangeCategory}
              />
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
              onClick={handleCreateCourse}
              loading={isLoading}
              disabled={checkStatusDisabledButtonCreate()}
            >
              Tạo khóa học
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateCourses;