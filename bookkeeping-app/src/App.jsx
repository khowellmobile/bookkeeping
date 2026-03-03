import "./App.css";

import { Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import { ToastCtxProvider } from "./components/contexts/ToastCtx";
import AuthenticatedApp from "./components/routing/AuthenticatedApp";
import { PropertiesCtxProvider } from "./components/contexts/PropertiesCtx";
import AccountActivatePage from "./pages/AccountActivatePage";
import PasswordResetPage from "./pages/PasswordResetPage";
import { AccountsCtxProvider } from "./components/contexts/AccountsCtx";

function App() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    return (
        <ToastCtxProvider>
            <Routes>
                <Route path="/" element={<SplashPage />} />
                <Route path="/activate/:uid/:token" element={<AccountActivatePage />} />
                <Route path="/password/reset/confirm/:uid/:token" element={<PasswordResetPage />} />
                <Route
                    path="/app/*"
                    element={
                        <PropertiesCtxProvider>
                            <AccountsCtxProvider>
                                <AuthenticatedApp />
                            </AccountsCtxProvider>
                        </PropertiesCtxProvider>
                    }
                />
            </Routes>
        </ToastCtxProvider>
    );
}

export default App;
