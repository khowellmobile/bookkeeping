import { useContext } from "react";
import { BASE_URL } from "../constants";
import AuthCtx from "../components/contexts/AuthCtx";
import { api } from "../Client";

export function useAuth() {
    const { setCtxAccessToken, setCtxUserData } = useContext(AuthCtx);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.detail || "Login failed please try again.";
                return { success: false, message: errorMessage };
            }

            setCtxAccessToken("cookie-session");
            await getUser();
            return { success: true, message: "Login successful." };
        } catch (error) {
            return { success: false, message: "A network error occurred. Please try again." };
        }
    };

    const logout = async () => {
        try {
            await api.post("/api/auth/logout/", {});
        } catch {
            // Even if logout endpoint fails, clear client auth state.
        }
        setCtxAccessToken(null);
        setCtxUserData({});
    };

    const getUser = async () => {
        try {
            const returnedProfile = await api.get("/api/profile/");
            setCtxUserData(returnedProfile);
            setCtxAccessToken("cookie-session");
            return { success: true, data: returnedProfile };
        } catch (e) {
            setCtxAccessToken(null);
            setCtxUserData({});
            return { success: false, error: e?.message || "Unable to fetch user profile." };
        }
    };

    const updateUser = async (updatedUser) => {
        try {
            const returnedProfile = await api.put("/api/profile/", updatedUser);
            setCtxUserData(returnedProfile);
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const updatePwd = async (pwdCurr, pwdNew, pwdCnfm) => {
        try {
            await api.post("/api/auth/users/set_password/", {
                current_password: pwdCurr,
                new_password: pwdNew,
                re_new_password: pwdCnfm,
            });
            return { success: true };
        } catch (e) {
            const errorData = e?.details;
            if (errorData) {
                let errorMessage = "Unknown error";
                if (errorData.current_password) {
                    errorMessage = errorData.current_password[0];
                } else if (errorData.new_password) {
                    errorMessage = errorData.new_password[0];
                } else if (errorData.re_new_password) {
                    errorMessage = errorData.re_new_password[0];
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                }
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "Network error updating Password" };
        }
    };

    const requestPswdReset = async (email) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/users/reset_password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            });
            if (response.status === 204 || response.ok) {
                return {
                    success: true,
                    message: "Success! If the email is registered, you will receive a reset link shortly.",
                };
            } else {
                return { success: false, message: "An error occurred. Please try again." };
            }
        } catch (e) {
            return { success: false, message: "A network error occurred. Please check your connection." };
        }
    };

    return {
        login,
        logout,
        getUser,
        updateUser,
        updatePwd,
        requestPswdReset,
    };
}
