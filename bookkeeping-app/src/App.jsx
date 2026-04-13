import "./App.css";

import { Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import { ToastCtxProvider } from "./contexts/ToastCtx";
import { ConfirmModalCtxProvider } from "./contexts/ConfirmModalCtx";
import AuthenticatedApp from "./routing/AuthenticatedApp";
import { PropertiesCtxProvider } from "./contexts/PropertiesCtx";
import AccountActivatePage from "./pages/AccountActivatePage";
import PasswordResetPage from "./pages/PasswordResetPage";
import { AccountsCtxProvider } from "./contexts/AccountsCtx";
import { AuthCtxProvider } from "./contexts/AuthCtx";

function App() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    return (
        <ToastCtxProvider>
            <ConfirmModalCtxProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <AuthCtxProvider>
                                <SplashPage />
                            </AuthCtxProvider>
                        }
                    />
                    <Route path="/activate/:uid/:token" element={<AccountActivatePage />} />
                    <Route path="/password/reset/confirm/:uid/:token" element={<PasswordResetPage />} />
                    <Route
                        path="/app/*"
                        element={
                            <AuthCtxProvider>
                                <PropertiesCtxProvider>
                                    <AccountsCtxProvider>
                                        <AuthenticatedApp />
                                    </AccountsCtxProvider>
                                </PropertiesCtxProvider>
                            </AuthCtxProvider>
                        }
                    />
                </Routes>
            </ConfirmModalCtxProvider>
        </ToastCtxProvider>
    );
}

export default App;
