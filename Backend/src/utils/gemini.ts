import express, { Request, Response, Router } from "express";
import axios from "axios";
import {sendEmail} from "./emailServic";

const geminiRouter = express.Router();

// Route để gọi Gemini API
geminiRouter.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: "Bạn là một trợ lý AI hữu ích, trả lời câu hỏi một cách thân thiện và chi tiết." },
              { text: message },
            ],
          },
        ],
      }
    );

    const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Không nhận được câu trả lời từ AI.";
    res.json({ content: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Route mới để tạo nội dung phản hồi và gửi email
geminiRouter.post("/reply-contact", async (req: Request, res: Response) => {
  const { email, description } = req.body as { email: string; description: string };

  try {
    // Tạo nội dung phản hồi bằng Gemini API
    const prompt = `Bạn là một trợ lý AI của một trang web. Một người dùng đã gửi phản hồi với nội dung sau: "${description}". Hãy viết một email phản hồi chuyên nghiệp, thân thiện và phù hợp với nội dung phản hồi của người dùng.`;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const aiResponse: string = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ xem xét ý kiến của bạn.";

    // Gửi email phản hồi
    await sendEmail(email, "Phản hồi từ trang web của chúng tôi", aiResponse);

    res.json({ message: "Phản hồi đã được gửi thành công!", replyContent: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


export default geminiRouter;