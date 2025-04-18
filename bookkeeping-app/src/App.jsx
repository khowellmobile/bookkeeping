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

function App() {
    return (
        <BkpgContextProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/accounts" element={<AccountsPage />} />
                    <Route path="/journals" element={<JournalsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Layout>
        </BkpgContextProvider>
    );
}

export default App;
