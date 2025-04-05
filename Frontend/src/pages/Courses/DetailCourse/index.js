import { Avatar, Modal, notification, Rate } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCoursesById, useUpdateCourses } from "../../../apis/courses.api";
import { Collapse, Card, Button, Typography, List } from "antd";
import {
  PlayCircleOutlined,
  FileTextOutlined,
  MinusOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  LaptopOutlined,
  ReadOutlined,
  CheckOutlined,
  HeartFilled,
  UserOutlined,
} from "@ant-design/icons";
import {
  useGetAllUsers,
  useGetUserById,
  useUpdateUser,
} from "../../../apis/auth.api";
import { useCreateReview } from "../../../apis/reviews.api";
import { useCreateNotification } from "../../../apis/notification.api";

const { Panel } = Collapse;
const { Title, Text } = Typography;

const DetailCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [listCourses, setListCourses] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [activeKey, setActiveKey] = useState(["1"]); // Mở chương đầu tiên mặc định
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    //console.log("token:", token);
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
      //console.log("payloadBase64", payloadBase64);
      const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
      //console.log("payload", payload?._id);
      return payload?._id || null;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const { mutate: updateCourse } = useUpdateCourses(
    (data) => {
      setIsRegistered(true);
      api.success({
        message: "Đăng ký thành công!",
        description: "Bạn đã đăng ký khóa học thành công.",
      });
    },
    (error) => {
      api.error({
        message: "Đăng ký thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra.",
      });
    }
  );

  const { mutate: updateUser } = useUpdateUser(
    (data) => {
      setIsRegistered(true);
      api.success({
        message: "Cập nhật thành công!",
        //description: "Bạn đã đăng ký khóa học thành công.",
      });
    },
    (error) => {
      api.error({
        message: "Cập nhật thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra.",
      });
    }
  );

  const { mutate: createReview } = useCreateReview(
    (data) => {
      api.success({
        message: "Đánh giá thành công!",
        description: "Cảm ơn bạn đã đánh giá khóa học.",
      });
      setReviewText(""); // Reset ô nhập liệu
      setRating(0); // Reset rating
    },
    (error) => {
      api.error({
        message: "Gửi đánh giá thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra.",
      });
    }
  );

  const { mutate: createNotification } = useCreateNotification();

  const userId = getUserIdFromToken(); // Lấy _id từ token
  //if (!userId) return null;
  console.log("userId:", userId);

  const handleRegisterCourse = () => {
    if (!userId) {
      api.error({ message: "Không tìm thấy thông tin người dùng" });
      return;
    }
    const updatedUsers = [...listCourses.users, userId];
    const updataCourses = [...listUsers.courses, id];
    console.log('updatedUsers:', updatedUsers);
    console.log('updataCourses:', updataCourses);

    updateCourse({ id, payload: { users: updatedUsers } });
    updateUser({ user: userId, payload: { courses: updataCourses } });

    // Tạo thông báo sau khi đăng ký
    const notificationTitle = `Xác nhận đăng ký cho khóa học '${listCourses.title || "Khóa học không xác định"}'`;
    createNotification({
      userId,
      message: notificationTitle, // Sử dụng message thay vì title
      type: "REGISTER_COURSE", // Thêm type
    });

    setIsRegistered(true);
  };

  const handleUnregisterCourse = () => {
    //const userId = getUserIdFromToken(); // Lấy _id từ token
    if (!userId) {
      api.error({ message: "Không tìm thấy thông tin người dùng" });
      return;
    }

    console.log("listUsers:", listUsers);

    // Xóa userId khỏi danh sách users trong courses
    const updatedUsers = listCourses.users.filter(
      (user) => user._id !== userId
    );
    const updataCourses = listUsers.courses.filter((course) => course._id !== id);

    // Gửi API cập nhật courses
    updateCourse({ id, payload: { users: updatedUsers } });

    // Xóa courseId khỏi danh sách courses của user
    updateUser({ user: userId, payload: { courses: updataCourses } });

    // Tạo thông báo sau khi đăng ký
    const notificationTitle = `Xác nhận đăng ký cho khóa học '${listCourses.title || "Khóa học không xác định"}'`;
    createNotification({
      userId,
      message: notificationTitle, // Sử dụng message thay vì title
      type: "REGISTER_COURSE", // Thêm type
    });

    api.success({ message: "Hủy đăng ký thành công!" });
    // Cập nhật state
    setIsCancelModalOpen(false);
    setIsRegistered(false);
  };

  const handleSendReview = () => {
    if (!userId) {
      api.error({ message: "Bạn cần đăng nhập để gửi đánh giá" });
      return;
    }
    if (rating === 0) {
      api.error({ message: "Vui lòng chọn số sao đánh giá" });
      return;
    }
    if (!reviewText.trim()) {
      api.error({ message: "Vui lòng nhập nội dung đánh giá" });
      return;
    }

    createReview(
      {
        courseId: id, // ID khóa học
        userId: userId, // ID người dùng
        rating: rating,
        comment: reviewText,
      },
      {
        onSuccess: (data) => {
          console.log("data:", data);
          const reviewId = data?.data?.data?._id; // Lấy ID của review vừa tạo
          console.log("reviewId:", reviewId);
          if (reviewId) {
            const updatedReviews = [...(listCourses.reviews || []), reviewId];

            // Cập nhật danh sách reviews trong course
            updateCourse({
              id,
              payload: { reviews: updatedReviews },
            });

            api.success({
              message: "Đánh giá thành công!",
              description: "Cảm ơn bạn đã đánh giá khóa học.",
            });

            // Reset form đánh giá
            setReviewText("");
            setRating(0);
          }
        },
        onError: (error) => {
          api.error({
            message: "Gửi đánh giá thất bại",
            description: error.response?.data?.message || "Có lỗi xảy ra.",
          });
        },
      }
    );
  };

  const { data: courseData } = useGetCoursesById(id, (data) => {
    setListCourses(data.data);
    if (data.data.users.includes(userId)) {
      setIsRegistered(true);
    }
  });

  const { data: userData } = useGetUserById(userId, {
    onSuccess: (data) => {
      setListUsers(data);
      console.log("UserData:", data);
    },
    onError: (error) => {
      console.error("Lỗi khi lấy user:", error);
    },
  });

  useEffect(() => {
    if (userData) {
      console.log("Dữ liệu userData khi vào trang:", userData);
      setListUsers(userData?.data);
    }
  }, [userData]);
  console.log("userData:", userData);

  useEffect(() => {
    if (courseData) {
      setListCourses(courseData?.data);

      // Lấy userId của người dùng hiện tại
      const userId = getUserIdFromToken();

      // Tạo một mảng chứa tất cả _id của users
      const userIds = courseData?.data?.users.map((user) => user._id);

      // Kiểm tra userId có trong danh sách không
      if (userIds.includes(userId)) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    }
  }, [courseData]);
  console.log("coursesData:", courseData);

  const handleOpenModal = (url) => {
    setVideoUrl(url);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVideoUrl(null); // Xóa URL video
  };

  const handleOpenModalReview = () => {
    setVideoUrl("https://youtu.be/M62l1xA5Eu8");
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-full mx-auto p-6 flex justify-between">
      {/* Phần nội dung khóa học (Bên trái) */}
      <div className="w-2/3 pr-8">
        <h1 className="text-3xl font-bold">{listCourses.title}</h1>
        <p className="mt-2 text-gray-600">{listCourses.description}</p>
        <h2 className="text-2xl font-bold mt-4">Bạn sẽ học được gì?</h2>
        <ul className="mt-2 list-disc list-inside">
          <li className="flex items-center ">
            <CheckOutlined className="mr-2 text-orange-500" />
            Các kiến thức cơ bản, nền móng của ngành IT
          </li>
          <li className="flex items-center ">
            <CheckOutlined className="mr-2 text-orange-500" />
            Các khái niệm, thuật ngữ cốt lõi khi triển khai ứng dụng
          </li>
          <li className="flex items-center ">
            <CheckOutlined className="mr-2 text-orange-500" />
            Các mô hình, kiến trúc cơ bản khi triển khai ứng dụng
          </li>
          <li className="flex items-center ">
            <CheckOutlined className="mr-2 text-orange-500" />
            Hiểu hơn về cách internet và máy vi tính hoạt động
          </li>
        </ul>
        <h2 className="text-2xl font-bold mt-8">Nội dung khóa học</h2>
        <p className="text-gray-600">
          {listCourses?.lessons?.length} bài học - {listCourses.category} -
          Người hướng dẫn: {listCourses.instructorId?.fullName}
        </p>

        <div className="max-w-3xl p-6 bg-white rounded-lg shadow mt-4">
          <Collapse
            activeKey={isRegistered ? activeKey : []}
            onChange={isRegistered ? setActiveKey : undefined}
            expandIcon={({ isActive }) =>
              isActive ? (
                <MinusOutlined className="text-red-500" />
              ) : (
                <PlusOutlined className="text-gray-500" />
              )
            }
            expandIconPosition="left"
            ghost
          >
            {listCourses?.lessons?.map((chapter) => (
              <Panel
                key={chapter._id}
                header={
                  <div className="flex justify-between w-full">
                    <span className="font-bold">{chapter.title}</span>
                    <span className="text-gray-600">
                      {chapter.resources?.length} tài nguyên
                    </span>
                  </div>
                }
                disabled={!isRegistered}
              >
                <ul className="pl-4">
                  {chapter.resources.map((resource, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center py-2 border-b last:border-none"
                    >
                      <div className="flex items-center gap-2">
                        <PlayCircleOutlined className="text-red-500" />
                        <button
                          onClick={() => handleOpenModal(resource)}
                          className="text-blue-500 underline"
                          disabled={!isRegistered}
                        >
                          {idx + 1}. {resource}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </Collapse>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Đánh giá khóa học</h2>
          <List
            itemLayout="vertical"
            dataSource={listCourses?.reviews || []}
            renderItem={(review) => (
              <List.Item className="bg-white p-4 rounded-lg shadow-md transition-all hover:shadow-lg mb-4">
                <div className="flex items-start gap-4">
                  <Avatar size={50} icon={<UserOutlined />} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {review.userId?.fullName || "Người dùng ẩn danh"}
                    </h3>
                    <Rate
                      disabled
                      value={review.rating}
                      className="text-yellow-400"
                    />
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* Modal hiển thị video */}
      <Modal
        title="Xem video"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        {videoUrl && (
          <video key={videoUrl} controls className="w-full rounded-lg">
            <source src={videoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        )}
      </Modal>

      <Modal
        title="Xác nhận hủy đăng ký"
        open={isCancelModalOpen}
        onOk={handleUnregisterCourse}
        onCancel={() => setIsCancelModalOpen(false)}
      >
        <p>Bạn có chắc chắn muốn hủy đăng ký khóa học này không?</p>
      </Modal>

      {/* Phần Video giới thiệu (Bên phải) */}
      <div className="w-1/3 sticky top-6">
        <div className="relative bg-gradient-to-r from-purple-500 to-red-500 p-4 rounded-lg shadow-lg h-48 flex flex-col items-center justify-center text-white font-bold text-lg">
          <div>Kiến Thức Nền Tảng</div>
          <div className="text-yellow-300 text-sm">Kiến thức nhập môn</div>
          <PlayCircleOutlined
            className="text-6xl text-white cursor-pointer mt-2"
            onClick={handleOpenModalReview}
          />
          <div className="mt-2 text-sm">Xem giới thiệu khóa học</div>
        </div>

        <div className="mt-4 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-center text-2xl font-bold text-orange-500">
            Miễn phí
          </h3>
          <button
            className={`w-full text-white font-bold py-2 rounded-lg mt-2 ${
              isRegistered ? "bg-red-500" : "bg-blue-500"
            }`}
            onClick={() =>
              isRegistered ? setIsCancelModalOpen(true) : handleRegisterCourse()
            }
          >
            {isRegistered ? "HỦY ĐĂNG KÝ" : "ĐĂNG KÝ HỌC"}
          </button>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>
              <LaptopOutlined /> Trình độ: Cơ bản
            </li>
            <li>
              <FileTextOutlined /> Tổng số: {listCourses?.lessons?.length} bài
              học
            </li>
            {/* <li><ClockCircleOutlined /> Thời lượng: 03 giờ 26 phút</li> */}
            <li>
              <ReadOutlined /> Học mọi lúc, mọi nơi
            </li>
          </ul>
        </div>
        <div className="mt-4 flex flex-col">
          <h2 className="text-1xl font-bold mb-2">Đánh giá của bạn</h2>

          <div className="mt-2">
            <Rate
              value={rating}
              onChange={setRating}
              disabled={!isRegistered}
              style={{ color: rating > 0 ? "red" : "gray" }}
            />
          </div>

          <div className="mt-2">
            <input
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Nhập nhận xét của bạn..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={!isRegistered}
            />
          </div>

          <div className="mt-2">
            <button
              className="bg-red-500 text-white px-4 py-1 rounded w-full"
              onClick={handleSendReview}
              disabled={!isRegistered}
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCourse;


