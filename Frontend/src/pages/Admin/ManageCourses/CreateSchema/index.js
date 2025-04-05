import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Table,
  Card,
  notification,
} from "antd";
import { useGetCourses } from "../../../../apis/courses.api";
import {
  useCreateSchedule,
  useGetAllSchedules,
} from "../../../../apis/schedule.api";

const { Option } = Select;

const CreateSchema = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [listCourses, setListCourses] = useState([]);
  const [listSchedules, setListSchedules] = useState([]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1]; // Lấy phần PAYLOAD từ JWT
      console.log("payloadBase64", payloadBase64);
      const payload = JSON.parse(atob(payloadBase64)); // Giải mã Base64
      console.log("payload", payload?._id);
      return payload?._id || null;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();
  console.log("userId:", userId);

  // Hook lấy danh sách khóa học
  const { data: courseData, isLoading: isLoadingCourses } = useGetCourses(
    (data) => {
      setListCourses(data);
    },
    (error) =>
      api.error({
        message: "Không thể tải danh sách khóa học",
        description: error.message,
      })
  );

  useEffect(() => {
    if (courseData) {
      setListCourses(courseData?.data);
    }
  }, [courseData]);

  const { mutate: createSchedule } = useCreateSchedule();

  const handleCreateSchedule = () => {
    form.validateFields().then((values) => {
      const newSchedule = {
        userCreated: userId,
        type: values.type,
        course: values.course,
        timeStart: values.timeStart.toISOString(),
        timeEnd: values.timeEnd.toISOString(),
      };

      console.log("Data being sent to API:", newSchedule);

      createSchedule(newSchedule, {
        onSuccess: () => {
          api.success({
            message: "Tạo lịch thành công",
          });
          form.resetFields();
        },
        onError: (error) => {
          api.error({
            message: "Tạo lịch thất bại",
            description: error.message,
          });
        },
      });
    });
  };

  // Hook để lấy danh sách đề thi
  const { data: scheduleData, isLoading: isLoadingCategory } =
    useGetAllSchedules(
      (data) => {
        setListSchedules(data.data); // Đảm bảo cập nhật đúng dữ liệu
      },
      (error) => {
        api.error({
          message: "Không thể tải danh mục",
          description: error.message,
        });
      }
    );

  useEffect(() => {
    if (scheduleData) {
      setListSchedules(scheduleData?.data);
    }
  }, [scheduleData]);
  console.log("examData:", scheduleData);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(dateString));
  };


  const columns = [
    { title: "Người tạo", dataIndex: "userCreated", key: "userCreated" },
    //{ title: "Người tham gia", dataIndex: "usersJoin", key: "usersJoin", render: (users) => users.map(user => `${user.userId} (${user.status})`).join(", ") },
    { title: "Loại", dataIndex: "type", key: "type" },
    { title: "Khoá học", dataIndex: "course", key: "course" },
    { title: "Bắt đầu", dataIndex: "timeStart", key: "timeStart" },
    { title: "Kết thúc", dataIndex: "timeEnd", key: "timeEnd" },
    {
      title: "Người tham gia",
      dataIndex: "usersJoin",
      key: "usersJoin",
      render: (users) =>
        users?.length ? (
          <ul style={{ paddingLeft: 20 }}>
            {users.map((user, index) => (
              <li key={index}>{user.userId?.fullName || ""}</li>
            ))}
          </ul>
        ) : (
          <span>Chưa có</span>
        ),
    },
    //{ title: "", dataIndex: "updatedAt", key: "updatedAt" },
  ];

  return (
    <Card
      style={{
        maxWidth: "90%",
        margin: "auto",
        padding: 20,
        overflow: "hidden",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Tạo Lịch Học</h2>
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 800, margin: "auto" }}
      >
        <Form.Item name="course" label="Khóa học">
          <Select placeholder="Chọn khóa học" loading={isLoadingCourses}>
            {listCourses.map((course) => (
              <Option key={course._id} value={course._id}>
                {course.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="type" label="Loại">
          <Select placeholder="Chọn loại">
            <Option value="Online">Online</Option>
            <Option value="Offline">Offline</Option>
          </Select>
        </Form.Item>

        <Form.Item name="timeStart" label="Thời gian bắt đầu">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="timeEnd" label="Thời gian kết thúc">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={handleCreateSchedule}
          >
            Tạo lịch
          </Button>
        </Form.Item>
      </Form>

      <h3 style={{ textAlign: "center" }}>Danh sách lịch học</h3>
      <div style={{ overflowX: "auto", maxWidth: "100%", paddingBottom: 20 }}>
        <Table
          columns={columns}
          dataSource={(listSchedules || []).map((schedule) => ({
            id: schedule?._id, // Kiểm tra null/undefined
            userCreated: schedule.userCreated.fullName,
            course: schedule?.course.title || "N/A",
            timeStart: formatDate(schedule?.timeStart) || "N/A",
            timeEnd: formatDate(schedule?.timeEnd) || "N/A",
            type: schedule?.type || "N/A",
            usersJoin: schedule.usersJoin || ""
          }))}
          loading={isLoadingCategory}
          rowKey="_id" // Đảm bảo tránh lỗi nếu key bị thiếu
        />
      </div>
    </Card>
  );
};

export default CreateSchema;

