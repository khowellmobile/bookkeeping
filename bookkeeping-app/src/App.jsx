import "./App.css";

import { Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import { ToastCtxProvider } from "./components/contexts/ToastCtx";
import AuthenticatedApp from "./components/routing/AuthenticatedApp";
import { AuthCtxProvider } from "./components/contexts/AuthCtx";
import { PropertiesCtxProvider } from "./components/contexts/PropertiesCtx";
import AccountActivatePage from "./pages/AccountActivatePage";

function App() {
    return (
        <ToastCtxProvider>
            <Routes>
                <Route path="/" element={<SplashPage />} />
                <Route path="/activate/:uid/:token" element={<AccountActivatePage />} />
                <Route
                    path="/app/*"
                    element={
                        <AuthCtxProvider>
                            <PropertiesCtxProvider>
                                <AuthenticatedApp />
                            </PropertiesCtxProvider>
                        </AuthCtxProvider>
                    }
                />
            </Routes>
        </ToastCtxProvider>
    );
}

export default App;
