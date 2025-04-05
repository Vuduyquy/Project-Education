import { NextFunction, Response } from 'express';
import { RequestCustom } from '../../../types/express.type';
import * as discussionService from '../services/discussion.service';

export const createDiscussion = async (
	req: RequestCustom,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { courseId, question } = req.body;
		const userId = req?.user?._id;

		if (!userId) {
			res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
			return;
		}

		const discussion = await discussionService.createDiscussion(
			courseId,
			userId,
			question
		);

		res.status(201).json(discussion);
	} catch (error) {
		next(error);
	}
};

export async function getDiscussionsByCourse(
	req: RequestCustom,
	res: Response
) {
	try {
		const { courseId } = req.params;
		const discussions = await discussionService.getDiscussionsByCourse(
			courseId
		);
		res.json(discussions);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Có lỗi xảy ra khi lấy danh sách thảo luận' });
	}
}

export const getDiscussionById = async (
	req: RequestCustom,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params;
		const discussion = await discussionService.getDiscussionById(id);

		if (!discussion) {
			res.status(404).json({ message: 'Không tìm thấy thảo luận' });
			return;
		}

		res.json(discussion);
	} catch (error) {
		next(error);
	}
};

export const addAnswer = async (
	req: RequestCustom,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params;
		const { answer } = req.body;
		const userId = req?.user?._id;

		if (!userId) {
			res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
			return;
		}

		const discussion = await discussionService.addAnswer(id, userId, answer);

		if (!discussion) {
			res.status(404).json({ message: 'Không tìm thấy thảo luận' });
			return;
		}

		res.json(discussion);
	} catch (error) {
		next(error);
	}
};

export const closeDiscussion = async (
	req: RequestCustom,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params;
		const discussion = await discussionService.closeDiscussion(id);

		if (!discussion) {
			res.status(404).json({ message: 'Không tìm thấy thảo luận' });
			return;
		}

		res.json(discussion);
	} catch (error) {
		next(error);
	}
};
