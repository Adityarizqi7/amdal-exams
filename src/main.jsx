import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "@material-tailwind/react";

import "./custom.css";
import "./index.css";
import store from "./store";
import GlobalProvider from "./context/GlobalProvider";
import { Provider } from "react-redux";
import Router from "./routes/Router";

window.addEventListener("contextmenu", e => e.preventDefault());

window.addEventListener('keydown', e => {
  // F12
    if (e.key === 'F12') e.preventDefault();

    // Ctrl+Shift+I or Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key)) e.preventDefault();

    // Ctrl+U (view-source)
    if (e.ctrlKey && e.key === 'u') e.preventDefault();

    // Ctrl+Shift+C (inspect element shortcut)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') e.preventDefault();

    // MacOS support (Meta+Option+I)
    if (e.metaKey && e.altKey && e.key.toLowerCase() === 'i') e.preventDefault();
});

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
