import Schedule, { ISchedule } from '../models/schedule.model';
import mongoose from 'mongoose';
import { CustomError } from '../../../utils/custom-error';

export const createSchedule = async (data: {
    userCreated: mongoose.Types.ObjectId;
    type: string;
    course?: mongoose.Types.ObjectId;
    timeStart: Date;
    timeEnd: Date;
}): Promise<ISchedule> => {
    const schedule = new Schedule({
        ...data,
        usersJoin: [{ userId: null, status: 'accepted' }]
    });
    return await schedule.save();
};

export const getScheduleById = async (id: string): Promise<ISchedule | null> => {
    return await Schedule.findById(id);
};

export const getAllSchedules = async (): Promise<ISchedule[]> => {
    return await Schedule.find().sort({ timeStart: -1 }).populate('course', 'title').populate('userCreated','fullName').populate({
        path: "usersJoin",
        populate: { path: "userId", select: "fullName" }, // Lấy tên người dùng từ userId
      });
};

export const updateSchedule = async (
    id: string,
    data: Partial<ISchedule>
): Promise<ISchedule | null> => {
    return await Schedule.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSchedule = async (id: string): Promise<ISchedule | null> => {
    return await Schedule.findByIdAndDelete(id);
};

export const joinSchedule = async (
    scheduleId: string,
    userId: mongoose.Types.ObjectId
): Promise<ISchedule | null> => {
    return await Schedule.findByIdAndUpdate(
        scheduleId,
        {
            $push: { usersJoin: { userId, status: 'pending' } }
        },
        { new: true }
    );
};

export const updateJoinStatus = async (
    scheduleId: string,
    userId: mongoose.Types.ObjectId,
    status: string
): Promise<ISchedule | null> => {
    return await Schedule.findOneAndUpdate(
        { 
            _id: scheduleId,
            'usersJoin.userId': userId 
        },
        {
            $set: { 'usersJoin.$.status': status }
        },
        { new: true }
    );
};

export const getUserSchedule = async (userId: string, startDate: Date, endDate: Date): Promise<ISchedule[]> => {
    return await Schedule.find({
        'usersJoin.userId': userId,
        timeStart: { $gte: startDate, $lte: endDate }
    }).sort({ timeStart: 1 });
};

export const checkScheduleConflict = async (
    userId: string,
    timeStart: Date,
    timeEnd: Date
): Promise<boolean> => {
    const conflictingSchedule = await Schedule.findOne({
        'usersJoin.userId': userId,
        $or: [
            {
                timeStart: { $lte: timeStart },
                timeEnd: { $gt: timeStart }
            },
            {
                timeStart: { $lt: timeEnd },
                timeEnd: { $gte: timeEnd }
            }
        ]
    });

    return !!conflictingSchedule;
};

export const getTeacherSchedule = async (teacherId: string): Promise<ISchedule[]> => {
    return await Schedule.find({
        userCreated: new mongoose.Types.ObjectId(teacherId)
    }).populate('usersJoin.userId', 'fullName email');
};

export const updateScheduleStatus = async (
    scheduleId: string,
    status: string
): Promise<ISchedule> => {
    const schedule = await Schedule.findByIdAndUpdate(
        scheduleId,
        { status },
        { new: true }
    );
    
    if (!schedule) throw new CustomError('Không tìm thấy lịch học', 404);
    return schedule;
};
