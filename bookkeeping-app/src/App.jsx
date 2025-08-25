import "./App.css";

import { Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import { ToastCtxProvider } from "./components/contexts/ToastCtx";
import AuthenticatedApp from "./components/routing/AuthenticatedApp";

function App() {
    return (
        <ToastCtxProvider>
            <Routes>
                <Route path="/" element={<SplashPage />} />
                <Route path="/*" element={<AuthenticatedApp />} />
            </Routes>
        </ToastCtxProvider>
    );
}

export default App;
