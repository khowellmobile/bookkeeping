import "./App.css";
import HomePage from "./pages/HomePage";
import AccountsPage from "./pages/AccountsPage";
import Layout from "./components/layout/Layout";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/accounts" element={<AccountsPage />} />
            </Routes>
        </Layout>
    );
}

export default App;
