import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import { ThemeProvider } from "@material-tailwind/react";

import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        {/* <ThemeProvider> */}
          <App />
        {/* </ThemeProvider> */}
    </BrowserRouter>
)


// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
