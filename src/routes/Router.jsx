import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'

// Authentication
// import Home from '@/pages/Home'

// Quiz
import Ready from '../pages/Quiz/Ready'
import QuizLayout from '../layouts/QuizLayout'

export default function Router() {

    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='quiz' element={<QuizLayout />}>
                <Route index element={<Ready />}/>
            </Route>
            {/* <Route path='*' element={<NotFound />} /> */}
        </Routes>
    )
}
