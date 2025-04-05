import { Layout, Menu, Card, Avatar, Statistic, Row, Col, notification } from 'antd';
import { UserOutlined, BookOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
//import { Line } from '@ant-design/plots';
import { useGetCourses } from '../../../apis/courses.api';
import { useGetExams } from '../../../apis/createExam.api';
import { useGetAllUsers } from '../../../apis/auth.api';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
    const [listCourses, setListCourses] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [listExams, setListExams] = useState([]);
    const [listUsers, setListUsers] = useState([]);

  // Hook lấy danh sách khóa học
  const {
    data: courseData,
    isLoading: isLoadingCourses,
  } = useGetCourses(
    (data) => setListCourses(data),
    (error) =>
      api.error({
        message: "Không thể tải danh sách khóa học",
        description: error.message,
      })
  );

  useEffect(() => {
    if (courseData) setListCourses(courseData?.data);
  }, [courseData]);

  // Hook để lấy danh sách đề thi  
  const { data: examData, isLoading: isLoadingCategory} = useGetExams(
    (data) => {
      setListExams(data.data); // Đảm bảo cập nhật đúng dữ liệu
    },
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (examData) {
      setListExams(examData?.data?.data);
    }
  }, [examData]);

  const { data: userData } = useGetAllUsers(
    (data) => {
      setListUsers(data);
    },
    (error) => {
      api.error({
        message: "Không thể tải danh mục",
        description: error.message,
      });
    }
  );

  useEffect(() => {
    if (userData) {
      setListUsers(userData?.data);
    }
  }, [userData]);


    const data = [
      { month: 'Jan', value: 50 },
      { month: 'Feb', value: 80 },
      { month: 'Mar', value: 60 },
      { month: 'Apr', value: 100 },
      { month: 'May', value: 120 },
    ];
  
    const config = {
      data,
      xField: 'month',
      yField: 'value',
      smooth: true,
      height: 300,
    };
  

  return (
    <>
        {/* Header */}
        <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'flex-end', paddingRight: 20 }}>
          <Avatar icon={<UserOutlined />} />
        </Header>

        {/* Content */}
        <Content style={{ margin: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card>
                <Statistic title="Số khóa học" value={listCourses.length} prefix={<BookOutlined />} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Số học viên" value={listUsers.filter(user => user.role === "student").length}  prefix={<UserOutlined />} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Số bài kiểm tra" value={listExams.length} prefix={<BarChartOutlined />} />
              </Card>
            </Col>
          </Row>
          {/* Thống kê biểu đồ */}
          {/* <Card style={{ marginTop: 20 }}>
            <h3>Thống kê số lượng học viên theo tháng</h3>
            <Line {...config} />
          </Card> */}
        </Content>
        </>
  );
}

export default Dashboard