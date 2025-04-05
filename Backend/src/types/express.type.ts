import { Request } from 'express';
import { UserPayload } from './user.type';

// export interface RequestCustom extends Request {
// 	user?: UserPayload 
	
// }
declare module "express-serve-static-core" {
	interface Request {
	  user?: UserPayload;
	}
  }
  
  export interface RequestCustom extends Request {}
  