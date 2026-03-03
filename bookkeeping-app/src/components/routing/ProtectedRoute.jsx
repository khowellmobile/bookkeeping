import { Navigate } from "react-router-dom";
import { UseAuth } from "../../hooks/UseAuth";

function ProtectedRoute({ children }) {
    const { accessToken: ctxAccessToken } = UseAuth();
    if (!ctxAccessToken) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;
