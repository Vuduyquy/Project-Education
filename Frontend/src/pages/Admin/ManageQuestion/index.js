// import React, { useState } from 'react';
// import { Card, Button, Space, message, Popconfirm, Tag, Modal, Form, Input, Radio, Divider } from 'antd';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { useDeleteQuestion, useGetQuestions, useUpdateQuestion } from '../../../apis/question.api';

// const QuestionList = () => {
//   const [form] = Form.useForm();
//   const [editingQuestion, setEditingQuestion] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   // Hook để lấy danh sách câu hỏi
//   const { data, isLoading, error, refetch } = useGetQuestions(
//     (response) => {
//       message.success('Lấy danh sách câu hỏi thành công!');
//     },
//     (error) => {
//       message.error('Lỗi khi lấy danh sách câu hỏi: ' + (error.response?.data?.message || error.message));
//     }
//   );

//   // Hook để xóa câu hỏi
//   const { mutate: deleteQuestion, isLoading: isDeleting } = useDeleteQuestion(
//     () => {
//       message.success('Xóa câu hỏi thành công!');
//       refetch(); // Làm mới danh sách sau khi xóa
//     },
//     (error) => {
//       message.error('Lỗi khi xóa câu hỏi: ' + (error.response?.data?.message || error.message));
//     }
//   );

//   // Hook để cập nhật câu hỏi
//   const { mutate: updateQuestion, isLoading: isUpdating } = useUpdateQuestion(
//     () => {
//       message.success('Cập nhật câu hỏi thành công!');
//       setIsModalVisible(false);
//       setEditingQuestion(null);
//       form.resetFields();
//       refetch(); // Làm mới danh sách sau khi cập nhật
//     },
//     (error) => {
//       message.error('Lỗi khi cập nhật câu hỏi: ' + (error.response?.data?.message || error.message));
//     }
//   );

//   // Xử lý khi nhấn nút Sửa
//   const handleEdit = (question) => {
//     setEditingQuestion(question);
//     setIsModalVisible(true);
//     form.setFieldsValue({
//       questionText: question.questionText,
//       questionType: Array.isArray(question.questionType) ? question.questionType[0] : question.questionType,
//       answers: question.answers.map((answer) => ({
//         answerText: answer.answerText,
//         isCorrect: answer.isCorrect,
//       })),
//     });
//   };

//   // Xử lý khi nhấn nút Xóa
//   const handleDelete = (id) => {
//     deleteQuestion(id);
//   };

//   // Xử lý khi gửi form cập nhật
//   const handleUpdate = async () => {
//     try {
//       const values = await form.validateFields();
//       const payload = {
//         questionText: values.questionText,
//         questionType: values.questionType,
//         answers: values.answers.map((answer) => ({
//           answerText: answer.answerText,
//           isCorrect: answer.isCorrect,
//         })),
//       };
//       updateQuestion({ id: editingQuestion._id, payload });
//     } catch (error) {
//       message.error('Vui lòng kiểm tra lại thông tin câu hỏi!');
//     }
//   };

//   // Dữ liệu câu hỏi từ API
//   const questionData = data?.data || [];

//   // Lọc bỏ các câu hỏi không hợp lệ (questionText hoặc questionType là null)
//   const validQuestions = questionData.filter(
//     (question) => question.questionText && (Array.isArray(question.questionType) ? question.questionType.length > 0 : question.questionType)
//   );

//   // Kiểm tra dữ liệu trước khi render
//   console.log('Dữ liệu câu hỏi hợp lệ:', validQuestions);

//   return (
//     <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
//       <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Danh sách câu hỏi</h1>

//       {/* Hiển thị trạng thái tải hoặc lỗi */}
//       {isLoading && <p style={{ textAlign: 'center' }}>Đang tải danh sách câu hỏi...</p>}
//       {error && <p style={{ color: 'red', textAlign: 'center' }}>Lỗi: {error.message}</p>}

//       {/* Danh sách câu hỏi với thanh cuộn dọc */}
//       <div
//         style={{
//           maxHeight: '70vh', // Giới hạn chiều cao để có thanh cuộn
//           overflowY: 'auto', // Thanh cuộn dọc
//           padding: '16px',
//           border: '1px solid #f0f0f0',
//           borderRadius: '8px',
//           backgroundColor: '#fafafa',
//         }}
//       >
//         {validQuestions.length === 0 && !isLoading && (
//           <p style={{ textAlign: 'center', color: '#888' }}>Chưa có câu hỏi nào.</p>
//         )}

//         {validQuestions.map((question, index) => {
//           // Xử lý questionType: nếu là mảng, lấy phần tử đầu tiên
//           const questionType = Array.isArray(question.questionType)
//             ? question.questionType[0] || 'essay' // Mặc định là 'essay' nếu mảng rỗng
//             : question.questionType;

//           // Xác định loại câu hỏi và màu sắc
//           const isSingleChoice = questionType === 'single_choice';
//           const questionTypeLabel = isSingleChoice ? 'Trắc nghiệm' : 'Tự luận';
//           const questionTypeColor = isSingleChoice ? 'blue' : 'green';

//           return (
//             <Card
//               key={question._id}
//               style={{ marginBottom: '16px', borderRadius: '8px' }}
//               bodyStyle={{ padding: '16px' }}
//               actions={[
//                 <Button
//                   type="link"
//                   icon={<EditOutlined />}
//                   onClick={() => handleEdit(question)}
//                 >
//                   Sửa
//                 </Button>,
//                 <Popconfirm
//                   title="Bạn có chắc chắn muốn xóa câu hỏi này?"
//                   onConfirm={() => handleDelete(question._id)}
//                   okText="Có"
//                   cancelText="Không"
//                 >
//                   <Button
//                     type="link"
//                     danger
//                     icon={<DeleteOutlined />}
//                     loading={isDeleting}
//                   >
//                     Xóa
//                   </Button>
//                 </Popconfirm>,
//               ]}
//             >
//               {/* Số thứ tự và nội dung câu hỏi */}
//               <div style={{ marginBottom: '12px' }}>
//                 <strong>Câu {index + 1}:</strong> {question.questionText}
//                 <Tag color={questionTypeColor} style={{ marginLeft: '8px' }}>
//                   {questionTypeLabel}
//                 </Tag>
//               </div>

//               {/* Danh sách đáp án (nếu có) */}
//               {isSingleChoice && (
//                 <div style={{ marginLeft: '20px', marginBottom: '12px' }}>
//                   {question.answers && question.answers.length > 0 ? (
//                     question.answers.map((answer, idx) => (
//                       <div key={idx} style={{ marginBottom: '4px' }}>
//                         {String.fromCharCode(97 + idx)}. {answer.answerText}{' '}
//                       </div>
//                     ))
//                   ) : (
//                     <p style={{ color: 'red' }}>
//                       Câu hỏi trắc nghiệm này chưa có đáp án!
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Đáp án đúng (nếu có) */}
//               {question.answerCorrect && (
//                 <div style={{ marginLeft: '20px', color: '#1890ff' }}>
//                   <strong>Đáp án đúng:</strong> {question.answerCorrect}
//                 </div>
//               )}

//               {/* Dòng phân cách giữa các câu hỏi */}
//               {index < validQuestions.length - 1 && <Divider />}
//             </Card>
//           );
//         })}
//       </div>

//       {/* Modal để chỉnh sửa câu hỏi */}
//       <Modal
//         title="Chỉnh sửa câu hỏi"
//         visible={isModalVisible}
//         onOk={handleUpdate}
//         onCancel={() => {
//           setIsModalVisible(false);
//           setEditingQuestion(null);
//           form.resetFields();
//         }}
//         okText="Cập nhật"
//         cancelText="Hủy"
//         confirmLoading={isUpdating}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Nội dung câu hỏi"
//             name="questionText"
//             rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
//           >
//             <Input.TextArea rows={4} placeholder="Nhập câu hỏi của bạn" />
//           </Form.Item>

//           <Form.Item
//             label="Loại câu hỏi"
//             name="questionType"
//             rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi!' }]}
//           >
//             <Radio.Group>
//               <Radio value="essay">Tự luận</Radio>
//               <Radio value="single_choice">Trắc nghiệm</Radio>
//             </Radio.Group>
//           </Form.Item>

//           <Form.List name="answers">
//             {(fields, { add, remove }) => (
//               <>
//                 {fields.map(({ key, name, ...restField }, index) => (
//                   <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
//                     <Form.Item
//                       {...restField}
//                       name={[name, 'answerText']}
//                       rules={[{ required: true, message: 'Vui lòng nhập nội dung đáp án!' }]}
//                     >
//                       <Input placeholder={`Đáp án ${index + 1}`} style={{ width: '300px' }} />
//                     </Form.Item>
//                     <Form.Item
//                       {...restField}
//                       name={[name, 'isCorrect']}
//                       valuePropName="checked"
//                     >
//                       <Radio>Đáp án đúng</Radio>
//                     </Form.Item>
//                     <Button
//                       type="link"
//                       onClick={() => remove(name)}
//                       style={{ color: 'red' }}
//                     >
//                       Xóa
//                     </Button>
//                   </Space>
//                 ))}
//                 <Form.Item>
//                   <Button
//                     type="dashed"
//                     onClick={() => add()}
//                     block
//                     disabled={form.getFieldValue('questionType') === 'essay'}
//                   >
//                     Thêm đáp án
//                   </Button>
//                 </Form.Item>
//               </>
//             )}
//           </Form.List>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default QuestionList;

import React, { useState } from 'react';
import { Card, Button, Space, message, Popconfirm, Tag, Modal, Form, Input, Radio, Divider, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDeleteQuestion, useGetQuestions, useUpdateQuestion } from '../../../apis/question.api';

const { Title } = Typography;

const QuestionList = () => {
  const [form] = Form.useForm();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hook để lấy danh sách câu hỏi
  const { data, isLoading, error, refetch } = useGetQuestions(
    (response) => {
      message.success('Lấy danh sách câu hỏi thành công!');
    },
    (error) => {
      message.error('Lỗi khi lấy danh sách câu hỏi: ' + (error.response?.data?.message || error.message));
    }
  );

  // Hook để xóa câu hỏi
  const { mutate: deleteQuestion, isLoading: isDeleting } = useDeleteQuestion(
    () => {
      message.success('Xóa câu hỏi thành công!');
      refetch(); // Làm mới danh sách sau khi xóa
    },
    (error) => {
      message.error('Lỗi khi xóa câu hỏi: ' + (error.response?.data?.message || error.message));
    }
  );

  // Hook để cập nhật câu hỏi
  const { mutate: updateQuestion, isLoading: isUpdating } = useUpdateQuestion(
    () => {
      message.success('Cập nhật câu hỏi thành công!');
      setIsModalVisible(false);
      setEditingQuestion(null);
      form.resetFields();
      refetch(); // Làm mới danh sách sau khi cập nhật
    },
    (error) => {
      message.error('Lỗi khi cập nhật câu hỏi: ' + (error.response?.data?.message || error.message));
    }
  );

  // Xử lý khi nhấn nút Sửa
  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalVisible(true);
    form.setFieldsValue({
      questionText: question.questionText,
      questionType: Array.isArray(question.questionType) ? question.questionType[0] : question.questionType,
      difficulty: question.difficulty, // Thêm difficulty vào form
      answers: question.answers.map((answer) => ({
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
      })),
    });
  };

  // Xử lý khi nhấn nút Xóa
  const handleDelete = (id) => {
    deleteQuestion(id);
  };

  // Xử lý khi gửi form cập nhật
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        questionText: values.questionText,
        questionType: [values.questionType], // Đảm bảo questionType là mảng
        difficulty: values.difficulty, // Thêm difficulty vào payload
        answers: values.answers.map((answer) => ({
          answerText: answer.answerText,
          isCorrect: answer.isCorrect,
        })),
      };
      updateQuestion({ id: editingQuestion._id, payload });
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin câu hỏi!');
    }
  };

  // Dữ liệu câu hỏi từ API
  const questionData = data?.data || [];

  // Lọc bỏ các câu hỏi không hợp lệ (questionText, questionType hoặc difficulty là null)
  const validQuestions = questionData.filter(
    (question) =>
      question.questionText &&
      (Array.isArray(question.questionType) ? question.questionType.length > 0 : question.questionType) &&
      question.difficulty
  );

  // Phân loại câu hỏi theo difficulty
  const easyQuestions = validQuestions.filter((q) => q.difficulty === 'easy');
  const mediumQuestions = validQuestions.filter((q) => q.difficulty === 'medium');
  const hardQuestions = validQuestions.filter((q) => q.difficulty === 'hard');

  // Kiểm tra dữ liệu trước khi render
  console.log('Dữ liệu câu hỏi hợp lệ:', validQuestions);

  // Hàm render danh sách câu hỏi cho từng mức độ
  const renderQuestions = (questions, title) => (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>{title}</Title>
      {questions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Chưa có câu hỏi nào ở mức độ này.</p>
      ) : (
        questions.map((question, index) => {
          // Xử lý questionType: nếu là mảng, lấy phần tử đầu tiên
          const questionType = Array.isArray(question.questionType)
            ? question.questionType[0] || 'essay' // Mặc định là 'essay' nếu mảng rỗng
            : question.questionType;

          // Xác định loại câu hỏi và màu sắc
          const isSingleChoice = questionType === 'single_choice';
          const questionTypeLabel = isSingleChoice ? 'Trắc nghiệm' : 'Tự luận';
          const questionTypeColor = isSingleChoice ? 'blue' : 'green';

          return (
            <Card
              key={question._id}
              style={{ marginBottom: '16px', borderRadius: '8px' }}
              bodyStyle={{ padding: '16px' }}
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(question)}
                >
                  Sửa
                </Button>,
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa câu hỏi này?"
                  onConfirm={() => handleDelete(question._id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    loading={isDeleting}
                  >
                    Xóa
                  </Button>
                </Popconfirm>,
              ]}
            >
              {/* Số thứ tự và nội dung câu hỏi */}
              <div style={{ marginBottom: '12px' }}>
                <strong>Câu {index + 1}:</strong> {question.questionText}
                <Tag color={questionTypeColor} style={{ marginLeft: '8px' }}>
                  {questionTypeLabel}
                </Tag>
                {/* <Tag color="orange" style={{ marginLeft: '8px' }}>
                  {question.difficulty === 'easy' ? 'Dễ' : question.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                </Tag> */}
              </div>

              {/* Danh sách đáp án (nếu có) */}
              {isSingleChoice && (
                <div style={{ marginLeft: '20px', marginBottom: '12px' }}>
                  {question.answers && question.answers.length > 0 ? (
                    question.answers.map((answer, idx) => (
                      <div key={idx} style={{ marginBottom: '4px' }}>
                        {String.fromCharCode(97 + idx)}. {answer.answerText}{' '}
                        
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'red' }}>
                      Câu hỏi trắc nghiệm này chưa có đáp án!
                    </p>
                  )}
                </div>
              )}

              {/* Đáp án đúng (nếu có) */}
              {question.answerCorrect && (
                <div style={{ marginLeft: '20px', color: '#1890ff' }}>
                  <strong>Đáp án đúng:</strong> {question.answerCorrect}
                </div>
              )}

              {/* Dòng phân cách giữa các câu hỏi */}
              {index < questions.length - 1 && <Divider />}
            </Card>
          );
        })
      )}
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Danh sách câu hỏi</h1>

      {/* Hiển thị trạng thái tải hoặc lỗi */}
      {isLoading && <p style={{ textAlign: 'center' }}>Đang tải danh sách câu hỏi...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>Lỗi: {error.message}</p>}

      {/* Danh sách câu hỏi với thanh cuộn dọc */}
      <div
        style={{
          maxHeight: '70vh', // Giới hạn chiều cao để có thanh cuộn
          overflowY: 'auto', // Thanh cuộn dọc
          padding: '16px',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
        }}
      >
        {/* Hiển thị câu hỏi theo từng mức độ */}
        {renderQuestions(easyQuestions, 'Câu hỏi dễ')}
        {renderQuestions(mediumQuestions, 'Câu hỏi trung bình')}
        {renderQuestions(hardQuestions, 'Câu hỏi khó')}
      </div>

      {/* Modal để chỉnh sửa câu hỏi */}
      <Modal
        title="Chỉnh sửa câu hỏi"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingQuestion(null);
          form.resetFields();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={isUpdating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nội dung câu hỏi"
            name="questionText"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập câu hỏi của bạn" />
          </Form.Item>

          <Form.Item
            label="Loại câu hỏi"
            name="questionType"
            rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi!' }]}
          >
            <Radio.Group>
              <Radio value="essay">Tự luận</Radio>
              <Radio value="single_choice">Trắc nghiệm</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Mức độ"
            name="difficulty"
            rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}
          >
            <Radio.Group>
              <Radio value="easy">Dễ</Radio>
              <Radio value="medium">Trung bình</Radio>
              <Radio value="hard">Khó</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.List name="answers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'answerText']}
                      rules={[{ required: true, message: 'Vui lòng nhập nội dung đáp án!' }]}
                    >
                      <Input placeholder={`Đáp án ${index + 1}`} style={{ width: '300px' }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'isCorrect']}
                      valuePropName="checked"
                    >
                      <Radio>Đáp án đúng</Radio>
                    </Form.Item>
                    <Button
                      type="link"
                      onClick={() => remove(name)}
                      style={{ color: 'red' }}
                    >
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    disabled={form.getFieldValue('questionType') === 'essay'}
                  >
                    Thêm đáp án
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionList;