import bcrypt from 'bcrypt';

export const hashPassword = async(password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);//Tao mot salt(do bao mat mat khau)
    return bcrypt.hash(password, salt);//Tra ve mk da ma hoa
}

//so sanh mat khau nhp vao voi mat khau da ma hoa trong co so du lieu
export const comparePassword = async(password: string, hashPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashPassword);//so sanh mat khau
}