import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "@material-tailwind/react";

import "./custom.css";
import "./index.css";
import store from "./store";
import GlobalProvider from "./context/GlobalProvider";
import { Provider } from "react-redux";
import Router from "./routes/Router";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <GlobalProvider>
            <BrowserRouter>
                {/* <ThemeProvider> */}
                <Router />
                {/* </ThemeProvider> */}
            </BrowserRouter>
        </GlobalProvider>
    </Provider>
);

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
