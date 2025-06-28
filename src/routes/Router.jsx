import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

// Authentication
import Login from '../pages/Authentication/Login'

// Dashboard
import EditExam from '../pages/Dashboard/Exam/EditExam'
import ListExam from '../pages/Dashboard/Exam/ListExam'
import CreateExam from '../pages/Dashboard/Exam/CreateExam'

import PreviewQuestion from '../pages/Dashboard/Question/PreviewQuestion'
import ListQuestion from '../pages/Dashboard/Question/ListQuestion'
import CreateQuestion from '../pages/Dashboard/Question/CreateQuestion'
import EditQuestion from "../pages/Dashboard/Question/EditQuestion";

// Quiz
import QuizLayout from '../layouts/QuizLayout'
import Ready from '../pages/Quiz/Ready'
import Info from "../pages/Quiz/Info";
import Finish from "../pages/Quiz/Finish";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import PrivateRoute from "./PrivateRoute";

export default function Router() {

    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route element={<App />}>
                <Route path='/login' element={
                    <ProtectedRoute>
                        <Login />
                    </ProtectedRoute>
                    } />
                <Route path='/admin/signin' element={
                    <ProtectedRoute>
                        <Login />
                    </ProtectedRoute>
                    } />

                {/* Exams */}
                <Route path='/dashboard/exam/create' element={
                    <PrivateRoute>
                        <CreateExam/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/exams' element={
                    <PrivateRoute>
                        <ListExam/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/exam/:id' element={
                    <PrivateRoute>
                        <EditExam/>
                    </PrivateRoute>
                    } />

                {/* Question */}
                <Route path='/dashboard/questions' element={
                    <PrivateRoute>
                        <ListQuestion/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/question/create' element={
                    <PrivateRoute>
                        <CreateQuestion/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/question/:id/edit' element={
                    <PrivateRoute>
                        <EditQuestion/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/question/:id/preview' element={
                    <PrivateRoute>
                        <PreviewQuestion/>
                    </PrivateRoute>
                    } />


                <Route path='quiz' element={
                    <PrivateRoute>
                        <QuizLayout />
                    </PrivateRoute>
                    }>
                    <Route index element={<Info />}/>
                    <Route path="ready" element={<Ready />}/>
                    <Route path="finish" element={<Finish />}/>
                </Route>
            </Route>
            <Route path='*' element={"Not Found"} />
        </Routes>
    )
}
