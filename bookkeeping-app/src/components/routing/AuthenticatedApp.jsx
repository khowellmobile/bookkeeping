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

function AuthenticatedApp() {
    return (
            <AuthCtxProvider>
                <PropertiesCtxProvider>
                    <AccountsCtxProvider>
                        <EntitiesCtxProvider>
                            <TransactionsCtxProvider>
                                <JournalsCtxProvider>
                                    <RentPaymentsCtxProvider>
                                        <Routes>
                                            <Route path="/home" element={<Layout><HomePage /></Layout>} />
                                            <Route path="/transactions" element={<Layout><TransactionsPage /></Layout>} />
                                            <Route path="/rents" element={<Layout><RentsPage /></Layout>} />
                                            <Route path="/accounts" element={<Layout><AccountsPage /></Layout>} />
                                            <Route path="/journals" element={<Layout><JournalsPage /></Layout>} />
                                            <Route path="/entities" element={<Layout><EntitiesPage /></Layout>} />
                                            <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
                                            <Route path="/properties" element={<Layout><PropertiesPage /></Layout>} />
                                            <Route path="/support" element={<Layout><SupportPage /></Layout>} />
                                            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
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