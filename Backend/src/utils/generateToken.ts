import jwt from 'jsonwebtoken';
import config from '../config/config';
import { IUser } from '../modules/user/models/user.model';

const generateToken = (user: IUser) => {
	return jwt.sign({ _id: user._id,fullName: user.fullName, role: user.role }, config.JWT_SECRET, {
		expiresIn: '7d',
	});
};

const generateRefreshToken = (user: IUser) => {
	return jwt.sign(
	  { _id: user._id, fullName: user.fullName, role: user.role },
	  config.JWT_REFRESH_SECRET, // Sử dụng secret riêng cho refresh token
	  {
		expiresIn: '30d', // Thời gian sống lâu hơn, ví dụ 30 ngày
	  }
	);
  };
  
  export { generateToken, generateRefreshToken };

