import "./App.css";

import { Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import { ToastCtxProvider } from "./components/contexts/ToastCtx";
import AuthenticatedApp from "./components/routing/AuthenticatedApp";
import { AuthCtxProvider } from "./components/contexts/AuthCtx";
import { PropertiesCtxProvider } from "./components/contexts/PropertiesCtx";

function App() {
    return (
        <ToastCtxProvider>
            <Routes>
                <Route path="/" element={<SplashPage />} />
                <Route
                    path="/*"
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
