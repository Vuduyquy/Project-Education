import Question, { IQuestion } from '../models/question.model';
import mongoose from 'mongoose';
import { CustomError } from '../../../utils/custom-error';

export const createQuestion = async (questionData: Partial<IQuestion>): Promise<IQuestion> => {
  const { questionText, answers, quizId, questionType, difficulty } = questionData;

  // Tính toán answerCorrect (chỉ cho single_choice)
  let answerCorrect: string | undefined = undefined;
  // Lấy giá trị đầu tiên của questionType (vì nó là mảng)
  const type = Array.isArray(questionType) && questionType.length > 0 ? questionType[0] : undefined;

  if (type === 'single_choice') {
    const correctAnswers = answers
      ?.filter((answer: { answerText: string; isCorrect: boolean }) => answer.isCorrect)
      .map((answer: { answerText: string; isCorrect: boolean }) => answer.answerText) || [];

    // Kiểm tra validation cho single_choice
    if (correctAnswers.length !== 1) {
      throw new CustomError('Câu hỏi single_choice phải có đúng 1 đáp án đúng', 400);
    }

    answerCorrect = correctAnswers[0]; // Lấy đáp án đúng duy nhất
  }

  const question = new Question({ questionText, answers, quizId, questionType, difficulty, answerCorrect });
  return await question.save();
};

export const getQuestionsByQuiz = async (quizId: string): Promise<IQuestion[]> => {
  // Vì quizId trong schema là mảng, tìm các câu hỏi có quizId chứa giá trị được cung cấp
  return await Question.find({ quizId: new mongoose.Types.ObjectId(quizId) });
};

export const getQuestionBank = async (filters: {
  questionType?: string;
  category?: string;
  difficulty?: string; // Thêm difficulty vào filters
}): Promise<IQuestion[]> => {
  const query: any = {};
  if (filters.questionType) {
    // Tìm các câu hỏi có questionType chứa giá trị filters.questionType
    query.questionType = filters.questionType;
  }
  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.difficulty) {
    query.difficulty = filters.difficulty; // Lọc theo difficulty
  }

  return await Question.find(query).populate('quizId', 'title');
};

export const updateQuestion = async (
  id: string,
  updateData: Partial<IQuestion>
): Promise<IQuestion | null> => {
  const { questionText, answers, quizId, questionType, difficulty } = updateData;

  // Tính toán answerCorrect (chỉ cho single_choice)
  let answerCorrect: string | undefined = undefined;
  // Lấy giá trị đầu tiên của questionType (nếu có), nếu không thì lấy từ câu hỏi hiện tại
  const existingQuestion = await Question.findById(id);
  if (!existingQuestion) {
    throw new CustomError('Không tìm thấy câu hỏi', 404);
  }

  const finalQuestionType = questionType || existingQuestion.questionType;
  const type = Array.isArray(finalQuestionType) && finalQuestionType.length > 0 ? finalQuestionType[0] : undefined;

  if (type === 'single_choice') {
    const correctAnswers = answers
      ?.filter((answer: { answerText: string; isCorrect: boolean }) => answer.isCorrect)
      .map((answer: { answerText: string; isCorrect: boolean }) => answer.answerText) || [];

    // Kiểm tra validation cho single_choice
    if (correctAnswers.length !== 1) {
      throw new CustomError('Câu hỏi single_choice phải có đúng 1 đáp án đúng', 400);
    }

    answerCorrect = correctAnswers[0]; // Lấy đáp án đúng duy nhất
  }

  return await Question.findByIdAndUpdate(
    id,
    { questionText, answers, quizId, questionType: finalQuestionType, difficulty, answerCorrect },
    { new: true }
  );
};

export const deleteQuestion = async (id: string): Promise<IQuestion | null> => {
  return await Question.findByIdAndDelete(id);
};

export const validateQuestionAnswers = async (
  questionId: string,
  userAnswers: string[]
): Promise<boolean> => {
  const question = await Question.findById(questionId);
  if (!question) throw new CustomError('Không tìm thấy câu hỏi', 404);

  // Lấy giá trị đầu tiên của questionType
  const type = Array.isArray(question.questionType) && question.questionType.length > 0 ? question.questionType[0] : undefined;

  if (type === 'single_choice') {
    // Sử dụng answerCorrect cho single_choice
    const correctAnswer = question.answerCorrect;
    return userAnswers.length === 1 && userAnswers[0] === correctAnswer;
  } else {
    // essay không có đáp án đúng
    return false;
  }
};
