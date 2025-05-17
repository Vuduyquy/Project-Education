import React, { useState } from 'react';
import { Form, Input, Button, Radio, Checkbox, Card, Typography, Space, Divider, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCreateQuestion } from '../../../../apis/question.api';

const { Title } = Typography;

const CreateQuestion = () => {
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      questionType: 'essay',
      answers: [],
      difficulty: 'easy',
    },
  ]);

  const { mutate: createQuestion, isLoading } = useCreateQuestion(
    () => {
      message.success('Tạo câu hỏi thành công!');
    },
    (error) => {
      message.error('Lỗi khi tạo câu hỏi: ' + (error.response?.data?.message || error.message));
    }
  );

  const addNewQuestion = () => {
    setQuestions([...questions, { questionText: '', questionType: 'essay', answers: [], difficulty: 'easy' }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionTypeChange = (index, type) => {
    const newQuestions = [...questions];
    newQuestions[index].questionType = type;
    if (type === 'single_choice' && newQuestions[index].answers.length === 0) {
      newQuestions[index].answers = [
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
      ];
    } else if (type === 'essay') {
      newQuestions[index].answers = [];
    }
    setQuestions(newQuestions);
  };

  const handleQuestionTextChange = (index, text) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = text;
    setQuestions(newQuestions);
  };

  const handleDifficultyChange = (index, difficulty) => {
    const newQuestions = [...questions];
    newQuestions[index].difficulty = difficulty;
    setQuestions(newQuestions);
  };

  const addAnswer = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].answers.push({ answerText: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex][field] = value;
    setQuestions(newQuestions);
  };

  const onFinish = async () => {
    const questionsData = questions.map(question => ({
      questionText: question.questionText,
      answers: question.answers || [],
      questionType: question.questionType,
      difficulty: question.difficulty,
    }));

    // Kiểm tra validation
    const hasEmptyQuestion = questionsData.some(q => !q.questionText);
    const hasEmptyAnswer = questionsData.some(
      q => q.questionType === 'single_choice' && q.answers.some(a => !a.answerText)
    );
    const hasNoCorrectAnswer = questionsData.some(
      q => q.questionType === 'single_choice' && !q.answers.some(a => a.isCorrect)
    );
    const hasInvalidSingleChoice = questionsData.some(
      q => q.questionType === 'single_choice' && q.answers.filter(a => a.isCorrect).length !== 1
    );
    const hasNoDifficulty = questionsData.some(q => !q.difficulty);

    if (hasEmptyQuestion) {
      message.error('Vui lòng nhập nội dung cho tất cả câu hỏi');
      return;
    }
    if (hasEmptyAnswer) {
      message.error('Vui lòng nhập nội dung cho tất cả đáp án');
      return;
    }
    if (hasNoCorrectAnswer) {
      message.error('Vui lòng chọn một đáp án đúng cho câu hỏi trắc nghiệm');
      return;
    }
    if (hasInvalidSingleChoice) {
      message.error('Câu hỏi trắc nghiệm phải có đúng 1 đáp án đúng');
      return;
    }
    if (hasNoDifficulty) {
      message.error('Vui lòng chọn mức độ cho tất cả câu hỏi');
      return;
    }

    try {
      console.log('Dữ liệu gửi đi:', questionsData);
      await Promise.all(questionsData.map(question => createQuestion(question)));
      setQuestions([{ questionText: '', questionType: 'essay', answers: [], difficulty: 'easy' }]);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi tạo câu hỏi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Tạo câu hỏi mới</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {questions.map((question, qIndex) => (
            <div key={qIndex}>
              {qIndex > 0 && <Divider />}
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Title level={4}>Câu hỏi {qIndex + 1}</Title>
                {questions.length > 1 && (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Xóa câu hỏi
                  </Button>
                )}
              </Space>

              <Form.Item label="Nội dung câu hỏi">
                <Input.TextArea
                  rows={4}
                  value={question.questionText}
                  onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                  placeholder="Nhập câu hỏi của bạn"
                />
              </Form.Item>

              <Form.Item label="Loại câu hỏi">
                <Radio.Group
                  onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                  value={question.questionType}
                >
                  <Radio value="essay">Tự luận</Radio>
                  <Radio value="single_choice">Trắc nghiệm</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Mức độ">
                <Radio.Group
                  onChange={(e) => handleDifficultyChange(qIndex, e.target.value)}
                  value={question.difficulty}
                >
                  <Radio value="easy">Dễ</Radio>
                  <Radio value="medium">Trung bình</Radio>
                  <Radio value="hard">Khó</Radio>
                </Radio.Group>
              </Form.Item>

              {question.questionType === 'single_choice' && (
                <Form.Item label="Đáp án">
                  {question.answers.map((answer, aIndex) => (
                    <Space key={aIndex} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Checkbox
                        checked={answer.isCorrect}
                        onChange={(e) => handleAnswerChange(qIndex, aIndex, 'isCorrect', e.target.checked)}
                      />
                      <Input
                        value={answer.answerText}
                        onChange={(e) => handleAnswerChange(qIndex, aIndex, 'answerText', e.target.value)}
                        placeholder={`Đáp án ${aIndex + 1}`}
                        style={{ width: '400px' }}
                      />
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => addAnswer(qIndex)}
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                  >
                    Thêm đáp án
                  </Button>
                </Form.Item>
              )}
            </div>
          ))}

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="dashed"
                onClick={addNewQuestion}
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
              >
                Thêm câu hỏi
              </Button>
              <Space>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Tạo tất cả câu hỏi
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => setQuestions([{ questionText: '', questionType: 'essay', answers: [] }])}
                >
                  Reset
                </Button>
              </Space>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateQuestion;