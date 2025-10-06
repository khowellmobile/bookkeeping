import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AccountActivatePage = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    console.log("------------------------------------------------");

    console.log(uid);
    console.log(token);

    const ACTIVATION_ENDPOINT = "http://127.0.0.1:8000/api/auth/users/activation/";

    useEffect(() => {
        if (!uid || !token) {
            console.log("Error: Missing uid or token in URL.");
            return;
        }

        const activateAccount = async () => {
            try {
                const response = await fetch(ACTIVATION_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ uid, token }),
                });

                // Djoser activation success is typically HTTP 204 No Content
                if (response.status === 204) {
                    // Success! Redirect to login page
                    console.log("SUCCESS");
                    /* navigate("/"); */
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (e) {
                console.log("Activation Error: " + e);
            }
        };

        activateAccount();
    }, [uid, token, navigate]);

    return (
        <div>
            <h2>Account Activation</h2>
            <p>Attempting to activate your account...</p>
        </div>
    );
};

export default AccountActivatePage;
