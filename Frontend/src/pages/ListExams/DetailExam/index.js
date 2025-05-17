import { Button, notification, Radio, Space, Spin, Typography } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetExambyId, usePutExam } from "../../../apis/createExam.api";
import "./styles.css";
import { useSubmitQuiz } from "../../../apis/user_quizz.api";
import { useGetUserById, useUpdateUser } from "../../../apis/auth.api";


const { Title, Text } = Typography;

const DetailExam = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [startTimer, setStartTimer] = useState(false);
  const [time, setTime] = useState(null); // phút * giây
  const [detailExam, setDetailExam] = useState(null);
  const [answerOfUser, setAnswerOfUser] = useState([]);
  const [score, setScore] = useState(null);
  const [isSubmited, setSubmited] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);

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

  // Hàm định dạng thời gian (phút:giây)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleStartExam = () => {
    setStartTimer(true);
    setStartTime(Date.now());
  };

  const { mutate: submitQuiz } = useSubmitQuiz(
    (data) => {
      api.success({ message: "Nộp bài thành công!" });
      setScore(data.score);
      setSubmited(true);
    },
    (error) => {
      api.error({ message: "Lỗi khi nộp bài", description: error.message });
    }
  );

  const { mutate: updateExam } = usePutExam(
    (data) => {
      api.success({
        message: "Cập nhật bài thi thành công!",
        description: "Thông tin bài thi đã được cập nhật.",
      });
    },
    (error) => {
      api.error({
        //message: "Lỗi khi cập nhật bài thi",
        description: error.message,
      });
    }
  );

  const {
    data: examData,
    isLoading: examLoading,
    isError,
  } = useGetExambyId(
    id,
    (data) => {
      if (!isSubmited) {
        // Chỉ cập nhật nếu chưa nộp bài
        setDetailExam(data?.data);
      }
    },
    (error) =>
      api.error({
        message: "Không thể tải đề thi",
        description: error.message,
      })
  );


  useEffect(() => {
    if (!isSubmited && examData) {
      setDetailExam(examData?.data);
      if (examData?.data?.duration) {
        setTime(examData.data.duration * 60);
      }
    }
  }, [examData, isSubmited]);

  const handleCalScore = (value, indexQuestion) => {
    const answerOfUserTemp = [...answerOfUser];
    answerOfUserTemp[indexQuestion] = value;
    setAnswerOfUser(answerOfUserTemp);
  };

  const { mutate: updateUser } = useUpdateUser(
    (data) => {
      setIsRegistered(true);
      api.success({
        message: "Cập nhật thành công!",
      });
    },
    (error) => {
      api.error({
        message: "Cập nhật thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra.",
      });
    }
  );

  const userId = getUserIdFromToken();

  const { data: userData } = useGetUserById(userId, {
    onSuccess: (data) => {
      setListUsers(data);
      console.log("UserData:", data);
    },
    onError: (error) => {
      console.error("Lỗi khi lấy user:", error);
    },
  });

  useEffect(() => {
    if (userData) {
      console.log("Dữ liệu userData khi vào trang:", userData);
      setListUsers(userData?.data);
    }
  }, [userData]);
  console.log("userData:", userData);

  const handleSubmitExam = useCallback(() => {
    const userId = getUserIdFromToken(); // Lấy _id từ token
    if (!userId) {
      api.error({ message: "Không tìm thấy thông tin giảng viên" });
      setIsLoading(false);
      return;
    }

    let countAnswerCorrect = 0;
    let highest_point = detailExam?.highest_point ?? 0;

    detailExam?.questions?.forEach((question, index) => {
      if (question.questionType?.[0] === "single_choice" || question.questionType?.[0] === "multiple_choice") {
        // Tìm đáp án đúng dựa trên isCorrect: true
        const correctIndex = question.answers.findIndex((answer) => answer.isCorrect === true);
        if (correctIndex !== -1) {
          if (answerOfUser[index] === correctIndex) {
            countAnswerCorrect += 1;
          }
        } else {
          console.warn(`Câu hỏi ${index + 1} không có đáp án đúng (isCorrect: true):`, question);
        }
      }
    });

    console.log("Tổng số câu đúng:", countAnswerCorrect);

    // Nếu đạt điểm cao hơn thì cập nhật highest_point trước
    if (countAnswerCorrect > highest_point) {
      const detailExamUpdate = {
        ...detailExam,
        highest_point: countAnswerCorrect,
      };

      updateExam(
        { id, payload: detailExamUpdate },
        {
          onSuccess: () => {
            console.log("Cập nhật highest_point thành công, giờ cập nhật score...");
          },
          onError: (error) => {
            console.error("Lỗi khi cập nhật highest_point:", error);
          },
        }
      );
    }

    const timeTakenInSeconds = Math.floor((Date.now() - startTime) / 1000) / 60; // Tính số giây làm bài

    // Lưu score vào state và localStorage ngay lập tức
    setScore(countAnswerCorrect);
    localStorage.setItem("score", JSON.stringify(countAnswerCorrect)); // Lưu vào localStorage để giữ lại sau khi tải lại trang
    setTimeTaken(timeTakenInSeconds); // Lưu thời gian vào state
    setSubmited(true);
    setIsActive(false); // Dừng thời gian ngay lập tức

    const record = {
      userId,
      quizId: id,
      score: countAnswerCorrect,
      timeTaken: timeTakenInSeconds,
      feedback: "Bài làm đã được nộp thành công.",
    };
    console.log("record:", record);

    submitQuiz(record);

    const updateExams = [...listUsers.quiz, id];
    updateUser({ user: userId, payload: { quiz: updateExams } });

  }, [detailExam, answerOfUser, id, updateExam, submitQuiz, api, listUsers, startTime, updateUser]);

  useEffect(() => {
    const storedScore = localStorage.getItem("score");
    if (storedScore) {
      setScore(JSON.parse(storedScore));
    }
  }, [score]);

  // Bắt đầu đếm ngược thời gian khi bài thi bắt đầu
  useEffect(() => {
    let interval = null;
    if (startTimer && !isActive) {
      setIsActive(true);
    }

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(interval);
            handleSubmitExam(); // Gọi hàm nộp bài khi hết thời gian
            return 0;
          }
          if (isSubmited) {
            clearInterval(interval);
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, startTimer, isSubmited, handleSubmitExam]);

  useEffect(() => {
    console.log("Score mới nhất:", score);
  }, [score]);

  if (examLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!detailExam || isError) {
    return <p>Không tìm thấy đề thi hoặc có lỗi xảy ra.</p>;
  }

  // Phân loại câu hỏi thành trắc nghiệm và tự luận
  const multipleChoiceQuestions = detailExam.questions.filter(
    (q) => q.questionType?.[0] === "single_choice" || q.questionType?.[0] === "multiple_choice"
  );
  const essayQuestions = detailExam.questions.filter(
    (q) => q.questionType?.[0] === "essay"
  );

  return (
    <div className="exam-detail-container">
      {contextHolder}

      {/* Nút bắt đầu làm bài (luôn đứng yên trên đầu) */}
      <div className="fixed-start-button">
        {!startTimer ? (
          <Button type="primary" onClick={handleStartExam}>
            Bắt đầu làm bài
          </Button>
        ) : (
          <h3>Thời gian còn lại: {formatTime(time)}</h3>
        )}
      </div>

      {/* Header */}
      <header className="exam-header">
        <div className="exam-title">
          <h1>{detailExam.title || "Tên Đề Thi"}</h1>
        </div>
        <div className="back-button">
          {isSubmited ? (
            <Button type="primary" danger onClick={() => navigate("/")}>
              Rời khỏi trang
            </Button>
          ) : (
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
          )}
        </div>
      </header>

      {/* Exam Info */}
      <section
        className="exam-info"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Thông Tin Đề Thi</h2>
          <p>
            <strong>Tên đề thi:</strong> {detailExam.title}
          </p>
          <p>
            <strong>Thời gian làm bài:</strong> {detailExam.duration} phút
          </p>
          <p>
            <strong>Số lượng câu hỏi:</strong> {detailExam.questions.length} câu
          </p>
        </div>

        {/* Chỉ hiển thị số câu đúng khi đã nộp bài */}
        {isSubmited && score !== null && (
          <div>
            <h2>Số câu trả lời đúng (Trắc nghiệm)</h2>
            <h1>
              {score}/{multipleChoiceQuestions.length || 0}
            </h1>
          </div>
        )}
      </section>

      {/* Phần Trắc nghiệm */}
      <section className="questions-section">
        <Title level={3}>Phần Trắc nghiệm</Title>
        {multipleChoiceQuestions.length > 0 ? (
          multipleChoiceQuestions.map((question, index) => {
            // Tìm đáp án đúng dựa trên isCorrect: true
            const correctIndex = question.answers.findIndex((answer) => answer.isCorrect === true);
            const userAnswer = answerOfUser[index]; // Đáp án người dùng chọn

            return (
              <div key={index} className="question-item">
                <p>
                  <strong>Câu {index + 1}:</strong> {question.questionText}
                </p>
                <div className="answer-options" style={{ marginTop: "10px" }}>
                  <Radio.Group
                    disabled={!startTimer || isSubmited} // Disable trước khi bắt đầu hoặc sau khi nộp bài
                    onChange={(e) => handleCalScore(e.target.value, index)}
                    value={userAnswer}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {question.answers.map((option, optIndex) => {
                        let answerStyle = {};
                        if (isSubmited && correctIndex !== -1) {
                          // Đáp án đúng luôn được tô màu xanh
                          if (optIndex === correctIndex) {
                            answerStyle = { color: "green", fontWeight: "bold" };
                          }
                          // Nếu người dùng chọn sai, tô màu đỏ cho đáp án họ chọn
                          if (userAnswer !== undefined && optIndex === userAnswer && optIndex !== correctIndex) {
                            answerStyle = { color: "red", fontWeight: "bold" };
                          }
                        }
                        return (
                          <Radio key={optIndex} value={optIndex} style={answerStyle}>
                            {String.fromCharCode(65 + optIndex)}. {option.answerText}
                          </Radio>
                        );
                      })}
                    </Space>
                  </Radio.Group>
                </div>
              </div>
            );
          })
        ) : (
          <Text style={{ color: "gray" }}>Không có câu hỏi trắc nghiệm.</Text>
        )}
      </section>

      {/* Phần Tự luận */}
      <section className="questions-section">
        <Title level={3}>Phần Tự luận</Title>
        {essayQuestions.length > 0 ? (
          essayQuestions.map((question, index) => (
            <div key={index} className="question-item">
              <p>
                <strong>Câu {index + 1}:</strong> {question.questionText}
              </p>
            </div>
          ))
        ) : (
          <Text style={{ color: "gray" }}>Không có câu hỏi tự luận.</Text>
        )}
      </section>

      {/* Chỉ hiển thị nút nộp bài khi bài thi đã bắt đầu */}
      {startTimer && !isSubmited && (
        <footer className="exam-footer">
          <Button
            type="primary"
            className="submit-button"
            onClick={handleSubmitExam}
          >
            Nộp bài
          </Button>
        </footer>
      )}
    </div>
  );
};

export default DetailExam;