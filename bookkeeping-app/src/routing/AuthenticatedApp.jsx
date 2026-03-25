import { Routes, Route } from "react-router-dom";

import { EntitiesCtxProvider } from "../contexts/EntitiesCtx";
import { TransactionsCtxProvider } from "../contexts/TransactionsCtx";
import { RentPaymentsCtxProvider } from "../contexts/RentPaymentsCtx";

import HomePage from "../pages/HomePage";
import TransactionsPage from "../pages/TransactionsPage";
import RentsPage from "../pages/RentsPage";
import AccountsPage from "../pages/AccountsPage";
import JournalsPage from "../pages/JournalsPage";
import ReportsPage from "../pages/ReportsPage";
import SupportPage from "../pages/SupportPage";
import SettingsPage from "../pages/SettingsPage";
import EntitiesPage from "../pages/EntitiesPage";
import PropertiesPage from "../pages/PropertiesPage";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

function AuthenticatedApp() {
    const wrapPage = (PageComponent) => {
        return (
            <ProtectedRoute>
                <Layout>
                    <PageComponent />
                </Layout>
            </ProtectedRoute>
        );
    };

    return (
        <TransactionsCtxProvider>
            <EntitiesCtxProvider>
                <RentPaymentsCtxProvider>
                    <Routes>
                        <Route path="/home" element={wrapPage(HomePage)} />
                        <Route path="/transactions" element={wrapPage(TransactionsPage)} />
                        <Route path="/rents" element={wrapPage(RentsPage)} />
                        <Route path="/accounts" element={wrapPage(AccountsPage)} />
                        <Route path="/journals" element={wrapPage(JournalsPage)} />
                        <Route path="/entities" element={wrapPage(EntitiesPage)} />
                        <Route path="/reports" element={wrapPage(ReportsPage)} />
                        <Route path="/properties" element={wrapPage(PropertiesPage)} />
                        <Route path="/support" element={wrapPage(SupportPage)} />
                        <Route path="/settings" element={wrapPage(SettingsPage)} />
                    </Routes>
                </RentPaymentsCtxProvider>
            </EntitiesCtxProvider>
        </TransactionsCtxProvider>
    );
}

export default AuthenticatedApp;
