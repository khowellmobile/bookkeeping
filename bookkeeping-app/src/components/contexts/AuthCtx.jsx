import { createContext, useState, useEffect } from "react";
import { api, configureApiClient } from "../../Client";

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
                const profile = await api.get("/api/profile/");
                if (!isMounted) {
                    return;
                }
                setCtxUserData(profile || {});
            } catch {
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
