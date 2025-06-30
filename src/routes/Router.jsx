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

import SetBatch from '../pages/Dashboard/Exam/Batch/SetBatch'
import ListExamBatch from '../pages/Dashboard/Exam/Batch/ListExamBatch'
import CreateBatch from '../pages/Dashboard/Exam/Batch/CreateBatch'
import EditBatch from "../pages/Dashboard/Exam/Batch/EditBatch";

import ListAnswers from '../pages/Dashboard/Answers/ListAnswers'
import CreateAnswers from "../pages/Dashboard/Answers/CreateAnswers";
import EditAnswers from "../pages/Dashboard/Answers/EditAnswers";

import ListUser from '../pages/Dashboard/User/ListUser'
import CreateUser from "../pages/Dashboard/User/CreateUser";
import EditUser from "../pages/Dashboard/User/EditUser";

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

                {/* Answers */}
                <Route path='/dashboard/answers' element={
                    <PrivateRoute>
                        <ListAnswers/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/answers/create' element={
                    <PrivateRoute>
                        <CreateAnswers/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/answers/:id/edit' element={
                    <PrivateRoute>
                        <EditAnswers/>
                    </PrivateRoute>
                    } />

                {/* Batch */}
                <Route path='/dashboard/batches' element={
                    <PrivateRoute>
                        <ListExamBatch/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/batch/create' element={
                    <PrivateRoute>
                        <CreateBatch/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/batch/:id/edit' element={
                    <PrivateRoute>
                        <EditBatch/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/batch/assign' element={
                    <PrivateRoute>
                        <SetBatch/>
                    </PrivateRoute>
                    } />
                
                {/* Users */}
                <Route path='/dashboard/users' element={
                    <PrivateRoute>
                        <ListUser/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/user/create' element={
                    <PrivateRoute>
                        <CreateUser/>
                    </PrivateRoute>
                    } />
                <Route path='/dashboard/user/:id/edit' element={
                    <PrivateRoute>
                        <EditUser/>
                    </PrivateRoute>
                    } />
                
                {/* Quiz */}
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
