// import React, { useState } from 'react';
// import { Card, Button, Space, message, Popconfirm, Tag, Modal, Form, Input, Radio, Divider, Typography } from 'antd';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { useDeleteQuestion, useGetQuestions, useUpdateQuestion } from '../../../apis/question.api';

// const { Title } = Typography;

// const QuestionList = () => {
//   const [form] = Form.useForm();
//   const [editingQuestion, setEditingQuestion] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const { data, isLoading, error, refetch } = useGetQuestions(
//     (response) => {
//       message.success('Lấy danh sách câu hỏi thành công!');
//     },
//     (error) => {
//       message.error('Lỗi khi lấy danh sách câu hỏi: ' + (error.response?.data?.message || error.message));
//     }
//   );

//   const { mutate: deleteQuestion, isLoading: isDeleting } = useDeleteQuestion(
//     () => {
//       message.success('Xóa câu hỏi thành công!');
//       refetch();
//     },
//     (error) => {
//       message.error('Lỗi khi xóa câu hỏi: ' + (error.response?.data?.message || error.message));
//     }
//   );

//   const { mutate: updateQuestion, isLoading: isUpdating } = useUpdateQuestion(
//     () => {
//       message.success('Cập nhật câu hỏi thành công!');
//       setIsModalVisible(false);
//       setEditingQuestion(null);
//       form.resetFields();
//       refetch();
//     },
//     (error) => {
//       message.error('Lỗi khi cập nhật câu hỏi: ' + (error.response?.data?.message || error.message));
//     }
//   );

//   const handleEdit = (question) => {
//     setEditingQuestion(question);
//     setIsModalVisible(true);
//     form.setFieldsValue({
//       questionText: question.questionText,
//       questionType: Array.isArray(question.questionType) ? question.questionType[0] : question.questionType,
//       difficulty: question.difficulty,
//       answers: question.answers.map((answer) => ({
//         answerText: answer.answerText,
//         isCorrect: answer.isCorrect,
//       })),
//     });
//   };

//   const handleDelete = (id) => {
//     deleteQuestion(id);
//   };

//   const handleUpdate = async () => {
//     try {
//       const values = await form.validateFields();
//       const payload = {
//         questionText: values.questionText,
//         questionType: [values.questionType],
//         difficulty: values.difficulty,
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

//   const questionData = data?.data || [];
//   const validQuestions = questionData.filter(
//     (question) =>
//       question.questionText &&
//       (Array.isArray(question.questionType) ? question.questionType.length > 0 : question.questionType) &&
//       question.difficulty
//   );

//   const easyQuestions = validQuestions.filter((q) => q.difficulty === 'easy');
//   const mediumQuestions = validQuestions.filter((q) => q.difficulty === 'medium');
//   const hardQuestions = validQuestions.filter((q) => q.difficulty === 'hard');

//   console.log('Dữ liệu câu hỏi hợp lệ:', validQuestions);

//   const renderQuestions = (questions, title) => (
//     <div style={{ marginBottom: '32px' }}>
//       <Title level={3}>{title}</Title>
//       {questions.length === 0 ? (
//         <p style={{ textAlign: 'center', color: '#888' }}>Chưa có câu hỏi nào ở mức độ này.</p>
//       ) : (
//         questions.map((question, index) => {
//           const questionType = Array.isArray(question.questionType)
//             ? question.questionType[0] || 'essay'
//             : question.questionType;

//           const isSingleChoice = questionType === 'single_choice';
//           const questionTypeLabel = isSingleChoice ? 'Trắc nghiệm' : 'Tự luận';
//           const questionTypeColor = isSingleChoice ? 'blue' : 'green';

//           return (
//             <Card
//               key={question._id}
//               style={{ marginBottom: '16px', borderRadius: '8px' }}
//               bodyStyle={{ padding: '16px' }}
//               actions={[
//                 <div
//                   style={{
//                     display: 'flex', // Sử dụng flex để chia đều chiều ngang
//                     width: '100%', // Chiếm toàn bộ chiều ngang của Card
//                     borderTop: '1px solid #f0f0f0', // Đường viền phía trên nút
//                   }}
//                 >
//                   <Button
//                     icon={<EditOutlined />}
//                     onClick={() => handleEdit(question)}
//                     style={{
//                       flex: 1, // Chiếm 50% chiều ngang
//                       backgroundColor: '#1890ff',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '8px', // Bo góc bằng 0 để nút vuông với Card
//                       padding: '8px 0px', // Tăng padding để nút cao hơn
//                       margin: '0px 25px',
//                       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//                       transition: 'all 0.3s ease',
//                       borderRight: '1px solid #f0f0f0', // Đường phân cách giữa hai nút
//                       textAlign: 'center', // Căn giữa nội dung
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = '#40a9ff';
//                       e.currentTarget.style.transform = 'scale(1.02)';
//                       e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor = '#1890ff';
//                       e.currentTarget.style.transform = 'scale(1)';
//                       e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
//                     }}
//                   >
//                     Sửa
//                   </Button>
//                   <Popconfirm
//                     title="Bạn có chắc chắn muốn xóa câu hỏi này?"
//                     onConfirm={() => handleDelete(question._id)}
//                     okText="Có"
//                     cancelText="Không"
//                   >
//                     <Button
//                       icon={<DeleteOutlined />}
//                       loading={isDeleting}
//                       style={{
//                         flex: 1, // Chiếm 50% chiều ngang
//                         backgroundColor: '#ff4d4f',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '8px',
//                         padding: '8px 0',
//                         margin: '0px 25px',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//                         transition: 'all 0.3s ease',
//                         textAlign: 'center',
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = '#ff7875';
//                         e.currentTarget.style.transform = 'scale(1.02)';
//                         e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = '#ff4d4f';
//                         e.currentTarget.style.transform = 'scale(1)';
//                         e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
//                       }}
//                     >
//                       Xóa
//                     </Button>
//                   </Popconfirm>
//                 </div>,
//               ]}
//             >
//               <div style={{ marginBottom: '12px' }}>
//                 <strong>Câu {index + 1}:</strong> {question.questionText}
//                 <Tag color={questionTypeColor} style={{ marginLeft: '8px' }}>
//                   {questionTypeLabel}
//                 </Tag>
//               </div>

//               {isSingleChoice && (
//                 <div style={{ marginLeft: '20px', marginBottom: '12px' }}>
//                   {question.answers && question.answers.length > 0 ? (
//                     question.answers.map((answer, idx) => (
//                       <div key={idx} style={{ marginBottom: '4px' }}>
//                         {String.fromCharCode(97 + idx)}. {answer.answerText}
//                       </div>
//                     ))
//                   ) : (
//                     <p style={{ color: 'red' }}>
//                       Câu hỏi trắc nghiệm này chưa có đáp án!
//                     </p>
//                   )}
//                 </div>
//               )}

//               {question.answerCorrect && (
//                 <div style={{ marginLeft: '20px', color: '#1890ff' }}>
//                   <strong>Đáp án đúng:</strong> {question.answerCorrect}
//                 </div>
//               )}

//               {index < questions.length - 1 && <Divider />}
//             </Card>
//           );
//         })
//       )}
//     </div>
//   );

//   return (
//     <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
//       <h1 style={{ textAlign: "center", fontWeight: "bold", paddingBottom: "20px", fontSize: "24px", color: "Black" }}>Danh sách câu hỏi</h1>

//       {isLoading && <p style={{ textAlign: 'center' }}>Đang tải danh sách câu hỏi...</p>}
//       {error && <p style={{ color: 'red', textAlign: 'center' }}>Lỗi: {error.message}</p>}

//       <div
//         style={{
//           maxHeight: '70vh',
//           overflowY: 'auto',
//           padding: '16px',
//           border: '1px solid #f0f0f0',
//           borderRadius: '8px',
//           backgroundColor: '#fafafa',
//         }}
//       >
//         {renderQuestions(easyQuestions, 'Câu hỏi dễ')}
//         {renderQuestions(mediumQuestions, 'Câu hỏi trung bình')}
//         {renderQuestions(hardQuestions, 'Câu hỏi khó')}
//       </div>

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

//           <Form.Item
//             label="Mức độ"
//             name="difficulty"
//             rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}
//           >
//             <Radio.Group>
//               <Radio value="easy">Dễ</Radio>
//               <Radio value="medium">Trung bình</Radio>
//               <Radio value="hard">Khó</Radio>
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
import { Card, Button, Space, message, Popconfirm, Tag, Modal, Form, Input, Checkbox, Divider, Typography, Radio } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDeleteQuestion, useGetQuestions, useUpdateQuestion } from '../../../apis/question.api';

const { Title } = Typography;

const QuestionList = () => {
  const [form] = Form.useForm();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, isLoading, error, refetch } = useGetQuestions(
    (response) => {
      message.success('Lấy danh sách câu hỏi thành công!');
    },
    (error) => {
      message.error('Lỗi khi lấy danh sách câu hỏi: ' + (error.response?.data?.message || error.message));
    }
  );

  const { mutate: deleteQuestion, isLoading: isDeleting } = useDeleteQuestion(
    () => {
      message.success('Xóa câu hỏi thành công!');
      refetch();
    },
    (error) => {
      message.error('Lỗi khi xóa câu hỏi: ' + (error.response?.data?.message || error.message));
    }
  );

  const { mutate: updateQuestion, isLoading: isUpdating } = useUpdateQuestion(
    () => {
      message.success('Cập nhật câu hỏi thành công!');
      setIsModalVisible(false);
      setEditingQuestion(null);
      form.resetFields();
      refetch();
    },
    (error) => {
      message.error('Lỗi khi cập nhật câu hỏi: ' + (error.response?.data?.message || error.message));
    }
  );

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsModalVisible(true);
    form.setFieldsValue({
      questionText: question.questionText,
      questionType: Array.isArray(question.questionType) ? question.questionType[0] : question.questionType,
      difficulty: question.difficulty,
      answers: question.answers.map((answer) => ({
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
      })),
    }, () => {
      console.log('Form values after set:', form.getFieldsValue());
    });
  };

  const handleDelete = (id) => {
    deleteQuestion(id);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        questionText: values.questionText,
        questionType: [values.questionType],
        difficulty: values.difficulty,
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

  const questionData = data?.data || [];
  const validQuestions = questionData.filter(
    (question) =>
      question.questionText &&
      (Array.isArray(question.questionType) ? question.questionType.length > 0 : question.questionType) &&
      question.difficulty
  );

  const easyQuestions = validQuestions.filter((q) => q.difficulty === 'easy');
  const mediumQuestions = validQuestions.filter((q) => q.difficulty === 'medium');
  const hardQuestions = validQuestions.filter((q) => q.difficulty === 'hard');

  console.log('Dữ liệu câu hỏi hợp lệ:', validQuestions);

  const renderQuestions = (questions, title) => (
    <div style={{ marginBottom: '32px' }}>
      <Title level={3}>{title}</Title>
      {questions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Chưa có câu hỏi nào ở mức độ này.</p>
      ) : (
        questions.map((question, index) => {
          const questionType = Array.isArray(question.questionType)
            ? question.questionType[0] || 'essay'
            : question.questionType;

          const isSingleChoice = questionType === 'single_choice';
          const questionTypeLabel = isSingleChoice ? 'Trắc nghiệm' : 'Tự luận';
          const questionTypeColor = isSingleChoice ? 'blue' : 'green';

          // Tìm đáp án đúng từ mảng answers
          const correctAnswer = question.answers?.find((answer) => answer.isCorrect === true);

          return (
            <Card
              key={question._id}
              style={{ marginBottom: '16px', borderRadius: '8px' }}
              bodyStyle={{ padding: '16px' }}
              actions={[
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(question)}
                    style={{
                      flex: 1,
                      backgroundColor: '#1890ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 0px',
                      margin: '0px 25px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease',
                      borderRight: '1px solid #f0f0f0',
                      textAlign: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#40a9ff';
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1890ff';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa câu hỏi này?"
                    onConfirm={() => handleDelete(question._id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      loading={isDeleting}
                      style={{
                        flex: 1,
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 0',
                        margin: '0px 25px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff7875';
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff4d4f';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>,
              ]}
            >
              <div style={{ marginBottom: '12px' }}>
                <strong>Câu {index + 1}:</strong> {question.questionText}
                <Tag color={questionTypeColor} style={{ marginLeft: '8px' }}>
                  {questionTypeLabel}
                </Tag>
              </div>

              {isSingleChoice && (
                <div style={{ marginLeft: '20px', marginBottom: '12px' }}>
                  {question.answers && question.answers.length > 0 ? (
                    question.answers.map((answer, idx) => (
                      <div key={idx} style={{ marginBottom: '4px' }}>
                        {String.fromCharCode(97 + idx)}. {answer.answerText}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'red' }}>
                      Câu hỏi trắc nghiệm này chưa có đáp án!
                    </p>
                  )}
                </div>
              )}

              {/* {isSingleChoice && correctAnswer && (
                <div style={{ marginLeft: '20px', color: '#1890ff' }}>
                  <strong>Đáp án đúng:</strong> {correctAnswer.answerText}
                </div>
              )} */}

              {index < questions.length - 1 && <Divider />}
            </Card>
          );
        })
      )}
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: "center", fontWeight: "bold", paddingBottom: "20px", fontSize: "24px", color: "Black" }}>Danh sách câu hỏi</h1>

      {isLoading && <p style={{ textAlign: 'center' }}>Đang tải danh sách câu hỏi...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>Lỗi: {error.message}</p>}

      <div
        style={{
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '16px',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
        }}
      >
        {renderQuestions(easyQuestions, 'Câu hỏi dễ')}
        {renderQuestions(mediumQuestions, 'Câu hỏi trung bình')}
        {renderQuestions(hardQuestions, 'Câu hỏi khó')}
      </div>

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
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues, allValues) => {
            if (changedValues.answers) {
              const updatedAnswers = allValues.answers.map((answer, index) => {
                if (changedValues.answers[index]?.isCorrect) {
                  return { ...answer, isCorrect: true };
                }
                return { ...answer, isCorrect: false };
              });
              form.setFieldsValue({ answers: updatedAnswers });
            }
          }}
        >
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
                {fields.map(({ key, name, ...restField }, index) => {
                  const label = String.fromCharCode(97 + index).toUpperCase(); // 'A', 'B', 'C', 'D'
                  return (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'answerText']}
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung đáp án!' }]}
                      >
                        <Input placeholder={`Đáp án ${label}`} style={{ width: '300px' }} />
                      </Form.Item>
                      {form.getFieldValue('questionType') === 'single_choice' && (
                        <Form.Item
                          {...restField}
                          name={[name, 'isCorrect']}
                          valuePropName="checked"
                        >
                          <Checkbox>Đáp án {label}</Checkbox>
                        </Form.Item>
                      )}
                      <Button
                        type="link"
                        onClick={() => remove(name)}
                        style={{ color: 'red' }}
                      >
                        Xóa
                      </Button>
                    </Space>
                  );
                })}
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