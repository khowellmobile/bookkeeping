import { useState, useEffect } from "react";
import { BASE_URL } from "../constants";

export function UseAuth() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
    const [userData, setUserData] = useState({});
    const baseUrl = BASE_URL;

    useEffect(() => {
        if (accessToken) {
            getUser();
        }
    }, [accessToken]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/jwt/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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

            const data = await response.json();
            const { access } = data;
            localStorage.setItem("accessToken", access);
            setAccessToken(access);
            return { success: true, message: "Login successful." };
        } catch (error) {
            return { success: false, message: "A network error occurred. Please try again." };
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAccessToken(null);
        setUserData({});
    };

    const getUser = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/profile/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const returnedProfile = await response.json();
            setUserData(returnedProfile);
        } catch (e) {
            // Optionally handle error
        }
    };

    const updateUser = async (updatedUser) => {
        try {
            const response = await fetch(`${baseUrl}/api/profile/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updatedUser),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const returnedProfile = await response.json();
            setUserData(returnedProfile);
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const updatePwd = async (pwdCurr, pwdNew, pwdCnfm) => {
        try {
            const response = await fetch(`${baseUrl}/api/auth/users/set_password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    current_password: pwdCurr,
                    new_password: pwdNew,
                    re_new_password: pwdCnfm,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
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
            return { success: true };
        } catch (e) {
            return { success: false, error: "Network error updating Password" };
        }
    };

    const requestPswdReset = async (email) => {
        try {
            const response = await fetch(`${baseUrl}/api/auth/users/reset_password/`, {
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
        accessToken,
        setAccessToken,
        userData,
        login,
        logout,
        getUser,
        updateUser,
        updatePwd,
        requestPswdReset,
    };
}
