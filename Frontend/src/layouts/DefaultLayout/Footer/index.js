import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer
      style={{
        position: "relative",
        backgroundColor: "black",
        color: "gray",
        padding: "40px 80px",
        textAlign: "left",
        width: "calc(100% - 250px)", // Trừ đi Sidebar 250px
        marginLeft: 250, // Đẩy footer sang phải để thẳng hàng với content
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {/* Cột 1: Logo + thông tin liên hệ */}
        <div>
          <h3 style={{ color: "#ff6600" }}> Học Lập Trình Để Đi Làm</h3>
          <p>📞 Điện thoại: 08 1919 8989</p>
          <p>📧 Email: contact@fullstack.edu.vn</p>
          <p>📍 Địa chỉ: Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội</p>
        </div>

        {/* Cột 2: Về F8 */}
        <div>
          <h3>Về education</h3>
          <p>Giới thiệu</p>
          <p>Liên hệ</p>
          <p>Điều khoản</p>
          <p>Bảo mật</p>
        </div>

        {/* Cột 3: Sản phẩm */}
        <div>
          <h3>SẢN PHẨM</h3>
          <p>Game Nester</p>
          <p>Game CSS Diner</p>
          <p>Game CSS Selectors</p>
          <p>Game Froggy</p>
          <p>Game Froggy Pro</p>
          <p>Game Scoops</p>
        </div>

        {/* Cột 4: Công cụ */}
        <div>
          <h3>CÔNG CỤ</h3>
          <p>Tạo CV xin việc</p>
          <p>Rút gọn liên kết</p>
          <p>Clip-path maker</p>
          <p>Snippet generator</p>
          <p>CSS Grid generator</p>
          <p>Cảnh báo sờ tay lên mặt</p>
        </div>
      </div>
    </Footer>
  );
};

export default CustomFooter;
