import React from 'react'
import { Routes, Route } from 'react-router-dom'

// import ScrollPage from '@/components/button/ScrollPage'

// Authentication
// import Home from '@/pages/Home'

export default function Router() {

    // const { slug } = useParams()

    return (
        // <ScrollPage>
            <Routes>
                <Route path='/' element={<Home />} />
                {/* <Route path='*' element={<NotFound />} /> */}
            </Routes>
        // </ScrollPage>
    )
}
