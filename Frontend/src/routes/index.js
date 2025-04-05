import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import Home from '../pages/Home';
import ListExams from '../pages/ListExams';
import DetailExam from '../pages/ListExams/DetailExam';
import Contact from '../pages/Contact';
import Courses from '../pages/Courses';
import DetailCourse from '../pages/Courses/DetailCourse';
import Disscusion from '../pages/Disscusion';
import Transcript from '../pages/Transcript';
import Profile from '../pages/Profile';
import ChangePassword from '../pages/ChangePassword';
import Admin from '../pages/Admin';
import Dashboard from '../pages/Admin/Dashboard';
import ManageExams from '../pages/Admin/ManageExams';
import CreateExam from '../pages/Admin/ManageExams/CreateExam';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageFeedback from '../pages/Admin/ManageFeedback';
import ManageCourses from '../pages/Admin/ManageCourses';
import CreateCourses from '../pages/Admin/ManageCourses/CreateCourses';
import Schema from '../pages/Schema';
import CreateSchema from '../pages/Admin/ManageCourses/CreateSchema';
import CreateLesson from '../pages/Admin/ManageLesson/CreateLesson';
import ManageLesson from '../pages/Admin/ManageLesson';
import ResetPassword from '../pages/ResetPassword';
import CreateQuestion from '../pages/Admin/ManageQuestion/CreateQuestion';
import QuestionList from '../pages/Admin/ManageQuestion';
import MyCourses from '../pages/UserCourse';
import NotificationPage from '../pages/Notification';



const RoutesApp = () => {
	return (
		<Routes>
			<Route path='reset-password/:token' element={<ResetPassword />} />
			<Route path='/' element={<DefaultLayout />}>
				<Route path='' element={<Home />} />
				<Route path='list-exams' element={<ListExams />} />
				<Route path='list-exams/:id' element={<DetailExam />} />
				<Route path='contact' element={<Contact />} />
				<Route path='courses' element={<Courses />} />
				<Route path='courses/:id' element={<DetailCourse />} />
				<Route path='disscusion' element={<Disscusion />} />
				<Route path='transcript' element={<Transcript />} />
				<Route path='profile' element={<Profile />} />
				<Route path='change-password' element={<ChangePassword />} />
				<Route path='schedule' element={<Schema/>}/>
				<Route path='usercourse' element={<MyCourses />} />
				<Route path='usercourse/:id' element={<DetailCourse />} />
				<Route path='notifications' element={<NotificationPage />} />
	
	
				
			</Route>
			<Route path='/admin' element={<Admin />}>
				<Route path='' element={<Dashboard />} />
				<Route path='exams' element={<ManageExams />} />
				<Route path='exams/create' element={<CreateExam />} />
				<Route path='courses' element={<ManageCourses />} />
				<Route path='courses/create' element={<CreateCourses />} />
				<Route path='courses/schedule' element={<CreateSchema/>}/>
				<Route path='lesson' element={<ManageLesson/>}/>
				<Route path='create/lesson' element={<CreateLesson />} />
				<Route path='question' element={<QuestionList/>}/>
				<Route path='create/question' element={<CreateQuestion />} />
				<Route path='users' element={<ManageUsers />} />
				{/* <Route path='users/schedule' element={<CreateSchema/>}/> */}
				<Route path='feedback' element={<ManageFeedback />} />
			</Route>
		</Routes>
	);
};

export default RoutesApp;
