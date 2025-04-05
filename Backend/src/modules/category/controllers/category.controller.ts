import { Response } from 'express';
import { RequestCustom } from '../../../types/express.type';
import * as categoryService from '../services/category.service';

export const getCategories = async (req: RequestCustom, res: Response) => {
	try {
		const { page, limit, sortBy, sortOrder, keyword, fields } = req.query;

		const result = await categoryService.findCategories({
			page: Number(page),
			limit: Number(limit),
			sortBy: sortBy as string,
			sortOrder: sortOrder as 'asc' | 'desc',
			keyword: keyword as string,
			fields: fields as string,
		});

		res.status(200).json({
			success: true,
			data: result.categories,
			pagination: result.pagination,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message || 'Lỗi khi lấy danh sách thể loại',
		});
	}
};

export const getCategory = async (req: RequestCustom, res: Response) => {
	try {
		const { fields } = req.query;

		const category = await categoryService.findCategoryById(
			req.params.id,
			fields as string
		);

		res.status(200).json({
			success: true,
			data: category,
		});
	} catch (error: any) {
		if (error.message.includes('ID không hợp lệ')) {
			res.status(400).json({
				success: false,
				message: error.message,
				error_code: 'INVALID_ID',
			});
			return;
		}

		if (error.message.includes('Không tìm thấy')) {
			res.status(404).json({
				success: false,
				message: error.message,
				error_code: 'CATEGORY_NOT_FOUND',
			});
			return;
		}

		res.status(500).json({
			success: false,
			message: 'Lỗi server khi lấy thông tin thể loại',
			error_code: 'SERVER_ERROR',
		});
	}
};

export const createCategory = async (req: RequestCustom, res: Response) => {
	try {
		// Validate dữ liệu đầu vào
		const { title, description } = req.body;
		if (!title) {
			res.status(400).json({
				success: false,
				message: 'Tiêu đề là bắt buộc',
				error_code: 'TITLE_REQUIRED',
			});
			return;
		}

		const category = await categoryService.createNewCategory(req.body);

		res.status(201).json({
			success: true,
			message: 'Tạo thể loại thành công',
			data: category,
		});
	} catch (error: any) {
		if (error.code === 11000) {
			// MongoDB duplicate key error
			res.status(400).json({
				success: false,
				message: 'Thể loại đã tồn tại',
				error_code: 'CATEGORY_EXISTS',
			});
			return;
		}

		res.status(400).json({
			success: false,
			message: error.message || 'Lỗi khi tạo thể loại',
			error_code: 'CREATE_ERROR',
		});
	}
};

export const updateCategory = async (req: RequestCustom, res: Response) => {
	try {
		// Validate dữ liệu đầu vào
		if (Object.keys(req.body).length === 0) {
			res.status(400).json({
				success: false,
				message: 'Dữ liệu cập nhật không được để trống',
				error_code: 'EMPTY_UPDATE_DATA',
			});
			return;
		}

		const category = await categoryService.updateCategoryById(
			req.params.id,
			req.body
		);

		res.status(200).json({
			success: true,
			message: 'Cập nhật thể loại thành công',
			data: category,
		});
	} catch (error: any) {
		if (error.message.includes('ID không hợp lệ')) {
			res.status(400).json({
				success: false,
				message: error.message,
				error_code: 'INVALID_ID',
			});
			return;
		}

		if (error.message.includes('Không tìm thấy')) {
			res.status(404).json({
				success: false,
				message: error.message,
				error_code: 'CATEGORY_NOT_FOUND',
			});
			return;
		}

		if (error.code === 11000) {
			res.status(400).json({
				success: false,
				message: 'Thể loại đã tồn tại',
				error_code: 'CATEGORY_EXISTS',
			});
			return;
		}

		res.status(500).json({
			success: false,
			message: 'Lỗi server khi cập nhật thể loại',
			error_code: 'UPDATE_ERROR',
		});
	}
};

export const deleteCategory = async (req: RequestCustom, res: Response) => {
	try {
		await categoryService.deleteCategoryById(req.params.id);

		res.status(200).json({
			success: true,
			message: 'Xóa thể loại thành công',
		});
	} catch (error: any) {
		if (error.message.includes('ID không hợp lệ')) {
			res.status(400).json({
				success: false,
				message: error.message,
				error_code: 'INVALID_ID',
			});
			return;
		}

		if (error.message.includes('Không tìm thấy')) {
			res.status(404).json({
				success: false,
				message: error.message,
				error_code: 'CATEGORY_NOT_FOUND',
			});
			return;
		}

		// Kiểm tra xem category có đang được sử dụng không
		if (error.message.includes('đang được sử dụng')) {
			res.status(400).json({
				success: false,
				message: 'Không thể xóa thể loại đang được sử dụng',
				error_code: 'CATEGORY_IN_USE',
			});
			return;
		}

		res.status(500).json({
			success: false,
			message: 'Lỗi server khi xóa thể loại',
			error_code: 'DELETE_ERROR',
		});
	}
};

export const createManyCategories = async (req: RequestCustom, res: Response) => {
	try {
		const { categories } = req.body;
		
		if (!Array.isArray(categories) || categories.length === 0) {
			 res.status(400).json({
				success: false,
				message: 'Dữ liệu không hợp lệ',
				error_code: 'INVALID_DATA'
			});
			return;
		}

		const result = await categoryService.createManyCategories(categories);

		res.status(201).json({
			success: true,
			message: 'Tạo danh sách thể loại thành công',
			data: result
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error.message || 'Lỗi khi tạo danh sách thể loại',
			error_code: 'CREATE_MANY_ERROR'
		});
	}
};

export const deleteManyCategories = async (req: RequestCustom, res: Response) => {
	try {
		const { ids } = req.body;

		if (!Array.isArray(ids) || ids.length === 0) {
			 res.status(400).json({
				success: false,
				message: 'Danh sách ID không hợp lệ',
				error_code: 'INVALID_IDS'
			});
			return;
		}

		await categoryService.deleteManyCategories(ids);

		res.status(200).json({
			success: true,
			message: 'Xóa danh sách thể loại thành công'
		});
	} catch (error: any) {
		res.status(400).json({
			success: false,
			message: error.message || 'Lỗi khi xóa danh sách thể loại',
			error_code: 'DELETE_MANY_ERROR'
		});
	}
};
