import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

// Authentication
import Login from '../pages/Authentication/Login'
import LoginAdmin from '../pages/Authentication/Login'

// Quiz
import Ready from '../pages/Quiz/Ready'
import QuizLayout from '../layouts/QuizLayout'

export default function Router() {

    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/admin/signin' element={<Login />} />
            <Route path='quiz' element={<QuizLayout />}>
                <Route index element={<Ready />}/>
            </Route>
            <Route path='*' element={"Not Found"} />
        </Routes>
    )
}
