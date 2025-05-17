import React from "react";
import { Badge, Layout, Menu } from "antd";
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
import { useGetNotifications } from "../../../apis/notification.api";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const { data: notificationsData } = useGetNotifications();
  const unreadCount = notificationsData?.filter((n) => !n.seen).length || 0;

  return (
    <Sider
      width={250}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 70, 
        backgroundColor: "white",
        color: "white",
        transition: "0.3s",
        
      }}
    >
      <Menu mode="vertical" selectedKeys={[location.pathname]}>
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <NavLink to="/">Trang chủ</NavLink>
        </Menu.Item>
        <Menu.Item key="/usercourse" icon={<BookOutlined />}>
          <NavLink to="/usercourse">Khoá học của tôi</NavLink>
        </Menu.Item>
        <Menu.Item key="/list-exams?subject=all" icon={<FileTextOutlined />}>
          <NavLink to="/list-exams?subject=all" className="desktop-item">
            Đề thi
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
        <Menu.Item
          key="/notifications"
          icon={
            <Badge count={unreadCount} size="small" offset={[5, -2]}>
              <BellOutlined />
            </Badge>
          }
        >
          <NavLink
            to="/notifications"
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            Thông báo
          </NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
