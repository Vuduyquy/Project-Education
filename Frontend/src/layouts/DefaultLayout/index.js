import { Layout } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Sidebar from "./SideBar";
import CustomFooter from "./Footer";

const { Content, Header } = Layout;

const DefaultLayout = () => {
  return (
    <>
    <Layout style={{ minHeight: "100vh" }}>
      {/* Navigation cố định trên cùng */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#001529",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Navigation />
      </div>

      {/* Bố cục chính */}
      <Layout style={{ marginTop: 64, display: "flex", flexDirection: "row" }}>
        {/* Sidebar cố định ngoài Content */}
        <div style={{ width: 250, position: "fixed", left: 0, top: 64, bottom: 0 }}>
          <Sidebar />
        </div>

        {/* Phần Content chính */}
        <Layout
          style={{
            marginLeft: 250, // Đẩy content sang phải để tránh Sidebar
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: "calc(100vh - 64px)", // Để Content chiếm hết phần còn lại
          }}
        >
          {/* Nội dung chính */}
          <Content style={{ flex: 1, padding: "16px", backgroundColor: "#f0f2f5" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      {/* Footer nằm ngoài Content nhưng vẫn trừ Sidebar */}
      <CustomFooter />
    </Layout>
    </>
  );
};

export default DefaultLayout;
