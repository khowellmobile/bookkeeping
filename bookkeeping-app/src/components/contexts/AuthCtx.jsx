import { createContext, useState, useEffect } from "react";
import { useToast } from "./ToastCtx";

const AuthCtx = createContext({
    ctxAccessToken: null,
    setCtxAccessToken: () => {},
    ctxUserData: null,
    ctxUpdateUser: () => {},
    logoutUser: () => {},
    requestPswdReset: () => {},
});

export function AuthCtxProvider(props) {
    const { showToast } = useToast();

    const [ctxAccessToken, setCtxAccessToken] = useState(localStorage.getItem("accessToken") || null);
    const [ctxUserData, setCtxUserData] = useState({});

    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        setCtxAccessToken(null);
    };

    useEffect(() => {
        if (ctxAccessToken) {
            ctxGetUser();
        }
    }, [ctxAccessToken]);

    const ctxGetUser = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/profile/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const returnedProfile = await response.json();
                setCtxUserData(returnedProfile);
            }
        } catch (e) {
            console.log("Error: " + e);
        }
    };

    const ctxUpdateUser = async (updatedUser) => {
        try {
            const response = await fetch(`http://localhost:8000/api/profile/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ctxAccessToken}`,
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                showToast("Error updating profile", "error", 5000);
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const returnedProfile = await response.json();
                console.log(returnedProfile);
                showToast("Profile updated", "success", 3000);
            }
        } catch (e) {
            console.log("Error: " + e);
            showToast("Error updating Profile", "error", 5000);
        }
    };

    const requestPswdReset = async (email) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/auth/users/reset_password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            });

            if (response.status === 204 || response.ok) {
                return "Success! If the email is registered, you will receive a reset link shortly.";
            } else {
                console.error("Reset Password Request Error Status:", response.status);
                return "An error occurred. Please try again.";
            }
        } catch (e) {
            console.error("Network Error:", e);
            return "A network error occurred. Please check your connection.";
        }
    };

    const context = {
        ctxAccessToken,
        setCtxAccessToken,
        ctxUserData,
        ctxUpdateUser,
        logoutUser,
        requestPswdReset,
    };

    return <AuthCtx.Provider value={context}>{props.children}</AuthCtx.Provider>;
}

export default AuthCtx;
