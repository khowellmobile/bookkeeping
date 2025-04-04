import "./App.css";
import HomePage from "./pages/HomePage";
import AccountsPage from "./pages/AccountsPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/accounts" element={<AccountsPage />} />
        </Routes>
    );
}

export default App;
