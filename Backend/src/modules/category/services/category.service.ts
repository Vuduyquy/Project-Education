import Category, { ICategory } from '../models/category.model';
import mongoose from 'mongoose';

interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
  fields?: string;
}

export const findCategories = async (options: QueryOptions = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      keyword = '',
      fields = '',
    } = options;

    // Tạo query filter
    const filter: any = {};
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // console.log('filter: ', filter)

    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;

    // Tạo sort object
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Xử lý select fields
    const selectFields = fields ? fields.split(',').join(' ') : '';

    // Thực hiện query với filter và phân trang
    const [categories, totalCount] = await Promise.all([
      Category.find(filter)
        .select(selectFields)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Category.countDocuments(filter)
    ]);

    return {
      categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    };
  } catch (error) {
    throw error;
  }
};

export const findCategoryById = async (id: string, fields?: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    // Xử lý select fields
    const selectFields = fields ? fields.split(',').join(' ') : '';

    const category = await Category.findById(id).select(selectFields);
    
    if (!category) {
      throw new Error('Không tìm thấy thể loại');
    }

    return category;
  } catch (error) {
    throw error;
  }
};

export const createNewCategory = async (categoryData: Partial<ICategory>) => {
  try {
    const category = new Category(categoryData);
    await category.save();
    return category;
  } catch (error) {
    throw error;
  }
};

export const updateCategoryById = async (id: string, categoryData: Partial<ICategory>) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    const category = await Category.findByIdAndUpdate(
      id, 
      categoryData,
      { 
        new: true, // Trả về document sau khi update
        runValidators: true // Chạy validation khi update
      }
    );

    if (!category) {
      throw new Error('Không tìm thấy thể loại');
    }

    return category;
  } catch (error) {
    throw error;
  }
};

export const deleteCategoryById = async (id: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    // Kiểm tra xem category có đang được sử dụng không
    // const isUsed = await Post.exists({ category: id });
    // if (isUsed) {
    //   throw new Error('Thể loại đang được sử dụng');
    // }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new Error('Không tìm thấy thể loại');
    }

    return category;
  } catch (error) {
    throw error;
  }
};

export const createManyCategories = async (categories: Partial<ICategory>[]) => {
  try {
    const result = await Category.insertMany(categories, { ordered: false });
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteManyCategories = async (ids: string[]) => {
  try {
    // Validate tất cả các ID
    const invalidId = ids.find(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidId) {
      throw new Error('ID không hợp lệ');
    }

    // Kiểm tra xem có category nào đang được sử dụng không
    // const usedCategory = await Post.exists({ category: { $in: ids } });
    // if (usedCategory) {
    //   throw new Error('Một số thể loại đang được sử dụng');
    // }

    const result = await Category.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      throw new Error('Không tìm thấy thể loại nào để xóa');
    }

    return result;
  } catch (error) {
    throw error;
  }
};
