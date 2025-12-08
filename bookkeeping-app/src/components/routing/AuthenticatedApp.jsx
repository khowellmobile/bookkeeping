import { Routes, Route } from "react-router-dom";

import { AuthCtxProvider } from "../contexts/AuthCtx";
import { AccountsCtxProvider } from "../contexts/AccountsCtx";
import { EntitiesCtxProvider } from "../contexts/EntitiesCtx";
import { TransactionsCtxProvider } from "../contexts/TransactionsCtx";
import { PropertiesCtxProvider } from "../contexts/PropertiesCtx";
import { JournalsCtxProvider } from "../contexts/JournalsCtx";
import { RentPaymentsCtxProvider } from "../contexts/RentPaymentsCtx";

import HomePage from "../../pages/HomePage";
import TransactionsPage from "../../pages/TransactionsPage";
import RentsPage from "../../pages/RentsPage";
import AccountsPage from "../../pages/AccountsPage";
import JournalsPage from "../../pages/JournalsPage";
import ReportsPage from "../../pages/ReportsPage";
import SupportPage from "../../pages/SupportPage";
import SettingsPage from "../../pages/SettingsPage";
import EntitiesPage from "../../pages/EntitiesPage";
import PropertiesPage from "../../pages/PropertiesPage";
import Layout from "../layout/Layout";
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

    const TransactionsWithContext = () => {
        return (
            <EntitiesCtxProvider>
                <TransactionsCtxProvider>{wrapPage(TransactionsPage)}</TransactionsCtxProvider>
            </EntitiesCtxProvider>
        );
    };

    const RentsWithContext = () => {
        return (
            <EntitiesCtxProvider>
                <RentPaymentsCtxProvider>{wrapPage(RentsPage)}</RentPaymentsCtxProvider>
            </EntitiesCtxProvider>
        );
    };

    const AccountsWithContext = () => {
        return wrapPage(AccountsPage);
    };

    const JournalsWithContext = () => {
        return <JournalsCtxProvider>{wrapPage(JournalsPage)}</JournalsCtxProvider>;
    };

    const EntitiesWithContext = () => {
        return (
            <TransactionsCtxProvider>
                <EntitiesCtxProvider>{wrapPage(EntitiesPage)}</EntitiesCtxProvider>
            </TransactionsCtxProvider>
        );
    };

    const ReportsWithContext = () => {
        return wrapPage(ReportsPage);
    };

    const PropertiesWithContext = () => {
        return wrapPage(PropertiesPage);
    };

    const HomePageWithContext = () => {
        return <RentPaymentsCtxProvider>{wrapPage(HomePage)}</RentPaymentsCtxProvider>;
    };

    return (
        <Routes>
            <Route path="/home" element={<HomePageWithContext />} />
            <Route path="/transactions" element={<TransactionsWithContext />} />
            <Route path="/rents" element={<RentsWithContext />} />
            <Route path="/accounts" element={<AccountsWithContext />} />
            <Route path="/journals" element={<JournalsWithContext />} />
            <Route path="/entities" element={<EntitiesWithContext />} />
            <Route path="/reports" element={<ReportsWithContext />} />
            <Route path="/properties" element={<PropertiesWithContext />} />
            <Route path="/support" element={wrapPage(SupportPage)} />
            <Route path="/settings" element={wrapPage(SettingsPage)} />
        </Routes>
    );
}

export default AuthenticatedApp;
