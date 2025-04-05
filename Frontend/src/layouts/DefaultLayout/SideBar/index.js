import React from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  MessageOutlined,
  ContactsOutlined,
  CalendarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, NavLink, useLocation } from "react-router-dom";
//import Notification from "../../../pages/Notification";

const { Sider } = Layout;

const Sidebar = () => {
const location = useLocation();
  return (
    <Sider
      width={250}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 64, // Để không bị chồng lên Navigation
        backgroundColor: "#001529",
        color: "white",
        transition: "0.3s",
      }}
    >
      <Menu theme="dark" mode="vertical" selectedKeys={[location.pathname]}>
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <NavLink to="/" >
            Trang chủ
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/usercourse" icon={<BookOutlined />}>
          <NavLink to="/usercourse">Khoá học của tôi</NavLink>
        </Menu.Item>
        <Menu.Item key="/list-exams?subject=all" icon={<FileTextOutlined />}>
          <NavLink to="/list-exams?subject=all" className="desktop-item">
            Môn thi
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/disscusion" icon={<MessageOutlined />}>
          <NavLink to="/disscusion">Thảo Luận-Hỏi đáp</NavLink>
        </Menu.Item>
        <Menu.Item key="/transcript" icon={<ContactsOutlined />}>
          <NavLink to="/transcript">Bảng điểm</NavLink>
        </Menu.Item>
        <Menu.Item key="/schedule" icon={<CalendarOutlined />}>
          <NavLink to="/schedule">Lịch khoá học</NavLink>
        </Menu.Item>
        <Menu.Item key="/contact" icon={<ContactsOutlined />}>
          <NavLink to="/contact">Liên hệ</NavLink>
        </Menu.Item>
        <Menu.Item key="/notifications" icon={<BellOutlined />}>
          <NavLink to="/notifications" style={{ display: "inline-flex", alignItems: "center" }}>
            Thông báo
          </NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
