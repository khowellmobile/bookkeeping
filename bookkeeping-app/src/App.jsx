import "./App.css";
import Layout from "./components/layout/Layout";

import { Routes, Route } from "react-router-dom";

import { BkpgContextProvider } from "./components/contexts/BkpgContext";

import HomePage from "./pages/HomePage";
import TransactionsPage from "./pages/TransactionsPage";
import AccountsPage from "./pages/AccountsPage";
import JournalsPage from "./pages/JournalsPage";
import ReportsPage from "./pages/ReportsPage";
import SupportPage from "./pages/SupportPage";
import SettingsPage from "./pages/SettingsPage";
import SplashPage from "./pages/SplashPage";
import EntitiesPage from "./pages/EntitiesPage";

function App() {
    return (
        <BkpgContextProvider>
            <Routes>
                <Route path="/" element={<SplashPage />} /> 
                <Route path="/home" element={<Layout><HomePage /></Layout>} />
                <Route path="/transactions" element={<Layout><TransactionsPage /></Layout>} />
                <Route path="/accounts" element={<Layout><AccountsPage /></Layout>} />
                <Route path="/journals" element={<Layout><JournalsPage /></Layout>} />
                <Route path="/entities" element={<Layout><EntitiesPage /></Layout>} />
                <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
                <Route path="/support" element={<Layout><SupportPage /></Layout>} />
                <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            </Routes>
        </BkpgContextProvider>
    );
}

export default App;
