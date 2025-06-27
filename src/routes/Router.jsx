import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

// Authentication
import Login from '../pages/Authentication/Login'
import LoginAdmin from '../pages/Authentication/Login'

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
