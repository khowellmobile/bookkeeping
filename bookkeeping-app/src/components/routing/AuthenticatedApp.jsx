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
                <Layout><PageComponent /></Layout>
            </ProtectedRoute>
        )
    }

    return (
            <AuthCtxProvider>
                <PropertiesCtxProvider>
                    <AccountsCtxProvider>
                        <EntitiesCtxProvider>
                            <TransactionsCtxProvider>
                                <JournalsCtxProvider>
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
                                </JournalsCtxProvider>
                            </TransactionsCtxProvider>
                        </EntitiesCtxProvider>
                    </AccountsCtxProvider>
                </PropertiesCtxProvider>
            </AuthCtxProvider>
    );
}

export default AuthenticatedApp;