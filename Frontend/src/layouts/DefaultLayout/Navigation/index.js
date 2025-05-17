import { Avatar, Button, Dropdown, Modal, notification } from "antd";
import { useFormik } from "formik";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useLogin, useRegister } from "../../../apis/auth.api";
import openNotification from "../../../config/notification";
import { AuthContext } from "../../../contexts/AuthContext";
import FormLogin from "./components/FormLogin";
import FormRegister from "./components/FormRegister";
import "./navigation.css";
import ROLE from "../../../config/role";
import { useGetExams } from "../../../apis/createExam.api";
import { useGetCourses } from "../../../apis/courses.api";

const registerSchema = Yup.object().shape({
  email: Yup.string().required("Email là bắt buộc").email("Email chưa hợp lệ"),
  fullName: Yup.string()
    .required("Tên người dùng là bắt buộc")
    .min(2, "Tên người dùng chưa hợp lệ")
    .max(50, "Tên người dùng chưa hợp lệ"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu quá ngắn")
    .max(24, "Mật khẩu quá dài"),
});

const loginSchema = Yup.object().shape({
  email: Yup.string().required("Email là bắt buộc").email("Email chưa hợp lệ"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu quá ngắn")
    .max(24, "Mật khẩu quá dài"),
});

const Navigation = () => {
  const navigate = useNavigate();
  const [listExams, setListExams] = useState([]);
  const [listCourses, setListCourses] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const {
    authState,
    login: loginSystem,
    logout: logoutSystem,
  } = useContext(AuthContext);

  const { user } = authState;
  const isLogined = authState.token;
  const role = user?.role;

  const [isShowModal, setIsShowModal] = useState(false);
  const [statusModal, setStatusModal] = useState(null);

  const handleShowModal = () => {
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    if (statusModal === "login") {
      formLogin.handleReset();
    }
    if (statusModal === "register") {
      formRegister.handleReset();
    }
    setIsShowModal(false);
  };

  const handleSetStatusModal = (status) => {
    setStatusModal(status);
    handleShowModal();
  };

  const { mutate: login, isPending: isLoadingLogin } = useLogin({
    onSuccess: (data) => {
      openNotification({
        type: "success",
        message: "Đăng nhập thành công",
      });

      const token = data.data.token;

      loginSystem(token);
      setIsShowModal(false);
    },
    onError: () => {
      openNotification({
        type: "error",
        message: "Đăng nhập thất bại",
      });
    },
  });

  const { mutate: register, isPending: isLoadingRegister } = useRegister({
    onSuccess: (data) => {
      openNotification({
        type: "success",
        message: "Đăng ký thành công",
      });

      const token = data.data.token;

      loginSystem(token);
      setIsShowModal(false);
    },
    onError: () => {
      openNotification({
        type: "error",
        message: "Đăng ký thất bại",
      });
    },
  });

  const { data: examData, isLoading: isLoadingCategory } = useGetExams(
    (data) => {
      setListExams(data);
    },
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );
  // useEffect(() => {
  //   if (examData) {
  //     setListExams(examData?.data.data);
  //   }
  // }, [examData]);

  const { data: courseData, isLoading: isLoadingCourses } = useGetCourses(
    (data) => setListCourses(data),
    (error) =>
      api.error({
        message: "Không thể tải danh sách khóa học",
        description: error.message,
      })
  );
  useEffect(() => {
    if (courseData && examData) {
      setListCourses(courseData?.data);
      setListExams(examData?.data);
    }
  }, [courseData, examData]);
  console.log("listExams:", listExams);

  const items = useMemo(() => {
    const result = [
      {
        key: "1",
        label: <Link to="/profile">Thông tin</Link>,
      },
      {
        key: "2",
        label: <Link to="/change-password">Đổi mật khẩu</Link>,
      },
      {
        key: "3",
        label: <div>Đăng xuất</div>,
        onClick: () => logoutSystem(),
      },
    ];

    if (role === ROLE.ADMIN || role === ROLE.TEACHER) {
      result.push({
        type: "divider",
      });
      result.push({
        key: "4",
        label: <Link to="/admin">Quản trị</Link>,
      });
    }

    return result;
  }, [role, logoutSystem]);

  const title = statusModal === "login" ? "Đăng nhập" : "Đăng ký";

  const handleSubmit = () => {
    console.log("statusModal: ", statusModal);
    if (statusModal === "login") {
      formLogin.handleSubmit();
    } else {
      formRegister.handleSubmit();
    }
  };

  const formRegister = useFormik({
    initialValues: {
      email: "",
      fullName: "",
      password: "",
    },
    validationSchema: registerSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      register(values);
    },
  });

  const formLogin = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      login(values);
    },
  });

  return (
    <>
      <nav className="nav-app">
        <div className="relative max-w-[90%] py-0 px-3 h-[70px] leading-[70px] m-auto flex items-center justify-between">
          <div className="logo text-white text-2xl font-bold flex items-center gap-2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3ujIGFpm3CPlD0Y8GM58caVZW0Q2ELAEvZh0uL6q-QkAXi_B9bO7GtUJEhiPGpuYc6tA&usqp=CAU"
              alt="Logo"
              className="w-12 h-12"
            />
            <Link
              to="#"
              className="hover:text-orange-400 transition-colors duration-300"
            >
              Education
            </Link>
          </div>
          <div>
            <input type="radio" name="slider" id="menu-btn" />
            <input type="radio" name="slider" id="close-btn" />
            <ul className="nav-links flex">
              <label htmlFor="close-btn" className="btn close-btn">
                <i className="fas fa-times" />
              </label>
              <li>
                <NavLink to="/">Trang chủ</NavLink>
              </li>
              <li>
                <NavLink to="/courses?subject=all">Khoá học</NavLink>
                <input type="checkbox" id="showDrop" />
                <label htmlFor="showDrop" className="mobile-item">
                  Dropdown Menu
                </label>
                <ul className="drop-menu">
                  {listCourses.map((course) => (
                    <li key={course.id}>
                      <NavLink
                        to={`/courses?subject=${course.title.toLowerCase()}`}
                        onClick={() =>
                          navigate(
                            `/courses?subject=${course.title.toLowerCase()}`
                          )
                        }
                        style={{ whiteSpace: "nowrap", display: "block" }}
                      >
                        {course.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <NavLink to="/list-exams?subject=all" className="desktop-item">
                  Đề thi
                </NavLink>
                <input type="checkbox" id="showDrop" />
                <label htmlFor="showDrop" className="mobile-item">
                  Đề thi
                </label>
                <ul className="drop-menu">
                  {listExams.map((exam) => (
                    <li key={exam.id}>
                      <NavLink
                        to={`/list-exams?subject=${exam.title.toLowerCase()}`}
                        onClick={() =>
                          navigate(
                            `/list-exams?subject=${exam.title.toLowerCase()}`
                          )
                        }
                        style={{ whiteSpace: "nowrap", display: "block" }}
                      >
                        {exam.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <NavLink to="/disscusion">Thảo luận - Hỏi đáp</NavLink>
              </li>
              <li>
                <NavLink to="/transcript">Bảng điểm</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Liên hệ</NavLink>
              </li>
            </ul>
            <label htmlFor="menu-btn" className="btn menu-btn">
              <i className="fas fa-bars" />
            </label>
          </div>

          <div className="profile">
            {isLogined ? (
              <Dropdown menu={{ items }} placement="top">
                <Avatar
                  size="large"
                  style={{
                    width: "55px",
                    height: "55px",
                    //background: "#ff8b26",
                  }}
                >
                  {user && user.fullName ? user.fullName : "U"}
                </Avatar>
              </Dropdown>
            ) : (
              <>
                <Button
                  style={{ margin: "0px 8px" }}
                  onClick={() => handleSetStatusModal("register")}
                >
                  Đăng ký
                </Button>
                <Button
                  style={{ margin: "0px 8px" }}
                  onClick={() => handleSetStatusModal("login")}
                >
                  Đăng nhập
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
      <Modal
        title={title}
        open={isShowModal}
        okText={title}
        cancelText="Đóng lại"
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        maskClosable={false}
        loading={isLoadingLogin || isLoadingRegister}
      >
        {statusModal === "login" ? (
          <FormLogin
            formLogin={formLogin}
            onRegister={() => setStatusModal("register")}
          />
        ) : (
          <FormRegister formRegister={formRegister} />
        )}
      </Modal>
    </>
  );
};

export default Navigation;
