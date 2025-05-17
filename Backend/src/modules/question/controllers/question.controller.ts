import { Request, Response, NextFunction } from 'express';
import Question from '../models/question.model';
import { getQuestionBank } from '../services/question.service';

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionText, answers, quizId, questionType, difficulty } = req.body;
    console.log('Dữ liệu nhận được:', req.body);

    // Tính toán answerCorrect (chỉ cho single_choice)
    let answerCorrect: string | undefined = undefined;
    const type = Array.isArray(questionType) && questionType.length > 0 ? questionType[0] : undefined;

    if (type === 'single_choice') {
      const correctAnswers = answers
        .filter((answer: { answerText: string; isCorrect: boolean }) => answer.isCorrect)
        .map((answer: { answerText: string; isCorrect: boolean }) => answer.answerText);

      // Kiểm tra validation cho single_choice
      if (correctAnswers.length !== 1) {
        res.status(400).json({ message: 'Câu hỏi single_choice phải có đúng 1 đáp án đúng' });
        return;
      }

      answerCorrect = correctAnswers[0]; // Lấy đáp án đúng duy nhất
    }

    // Tạo câu hỏi với answerCorrect và difficulty
    const question = await Question.create({
      questionText,
      answers,
      quizId,
      questionType,
      difficulty,
      answerCorrect,
    });

    res.status(201).json({ message: 'Tạo câu hỏi thành công', question });
  } catch (error: any) {
    console.error('Lỗi khi tạo câu hỏi:', error);
    res.status(500).json({ message: 'Lỗi khi tạo câu hỏi', error: error.message || error });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await Question.find();
        res.status(200).json( questions );
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách câu hỏi', error });
    }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { questionText, answers, quizId, questionType, difficulty } = req.body;

    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      res.status(404).json({ message: 'Không tìm thấy câu hỏi để cập nhật' });
      return;
    }

    // Tính toán answerCorrect (chỉ khi answers được gửi lên và questionType là single_choice)
    let answerCorrect: string | undefined = undefined;
    const finalQuestionType = questionType || existingQuestion.questionType;
    const type = Array.isArray(finalQuestionType) && finalQuestionType.length > 0 ? finalQuestionType[0] : undefined;

    if (type === 'single_choice' && answers) {
      const correctAnswers = answers
        .filter((answer: { answerText: string; isCorrect: boolean }) => answer.isCorrect)
        .map((answer: { answerText: string; isCorrect: boolean }) => answer.answerText);

      if (correctAnswers.length !== 1) {
        res.status(400).json({ message: 'Câu hỏi single_choice phải có đúng 1 đáp án đúng' });
        return;
      }

      answerCorrect = correctAnswers[0];
    }

    // Tạo object update chỉ với các trường được gửi lên
    const updateData: any = {};
    if (questionText !== undefined) updateData.questionText = questionText;
    if (answers !== undefined) updateData.answers = answers;
    if (quizId !== undefined) updateData.quizId = quizId;
    if (questionType !== undefined) updateData.questionType = questionType;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (answerCorrect !== undefined) updateData.answerCorrect = answerCorrect;

    const question = await Question.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!question) {
      res.status(404).json({ message: 'Không tìm thấy câu hỏi để cập nhật' });
      return;
    }

    res.status(200).json({ message: 'Cập nhật câu hỏi thành công', question });
  } catch (error) {
    console.error('Error updating question:', error);
    next(error);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const question = await Question.findByIdAndDelete(id);

        if (!question) {
            res.status(404).json({ message: 'Không tìm thấy câu hỏi để xóa' });
            return;
        }

        res.status(200).json({ message: 'Xóa câu hỏi thành công' });
    } catch (error) {
        next(error);
    }
};

// Thêm hàm để lọc câu hỏi theo difficulty (gọi từ service)
export const getQuestionsByFilters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { questionType, category, difficulty } = req.query;
    const questions = await getQuestionBank({
      questionType: questionType as string,
      category: category as string,
      difficulty: difficulty as string,
    });
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};

