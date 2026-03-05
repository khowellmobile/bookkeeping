import { createContext, useState, useEffect } from "react";
import { BASE_URL } from "../../constants";

const AuthCtx = createContext({
    ctxAccessToken: null,
    ctxUserData: {},
});

export function AuthCtxProvider(props) {
    const [ctxAccessToken, setCtxAccessToken] = useState(localStorage.getItem("accessToken") || null);
    const [ctxUserData, setCtxUserData] = useState({});

    useEffect(() => {
        let isMounted = true;

        const getUserData = async () => {
            if (!ctxAccessToken) {
                if (isMounted) {
                    setCtxUserData({});
                }
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/api/profile/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${ctxAccessToken}`,
                    },
                });

                if (!isMounted) {
                    return;
                }

                if (response.ok) {
                    const profile = await response.json();
                    setCtxUserData(profile);
                } else {
                    setCtxUserData({});
                }
            } catch (error) {
                if (isMounted) {
                    setCtxUserData({});
                }
            }
        };

        getUserData();

        return () => {
            isMounted = false;
        };
    }, [ctxAccessToken]);

    const context = {
        ctxAccessToken,
        setCtxAccessToken,
        ctxUserData,
        setCtxUserData,
    };

    return <AuthCtx.Provider value={context}>{props.children}</AuthCtx.Provider>;
}

export default AuthCtx;
