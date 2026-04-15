import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthCtx from "../contexts/AuthCtx";

function ProtectedRoute({ children }) {
    const { ctxAccessToken, ctxAuthLoading } = useContext(AuthCtx);

    if (ctxAuthLoading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!ctxAccessToken) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
