import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import QuizLayout from '../layouts/QuizLayout'
import Ready from '../pages/Quiz/Ready'

// import ScrollPage from '@/components/button/ScrollPage'

// Authentication
// import Home from '@/pages/Home'

export default function Router() {

    // const { slug } = useParams()

    return (
        // <ScrollPage>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='quiz' element={<QuizLayout />}>
                    <Route index element={<Ready />}/>
                </Route>
                {/* <Route path='*' element={<NotFound />} /> */}
            </Routes>
        // </ScrollPage>
    )
}
