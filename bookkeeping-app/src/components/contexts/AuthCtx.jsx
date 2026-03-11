import { createContext, useState, useEffect } from "react";
import { api, configureApiClient } from "../../Client";

const AuthCtx = createContext({
    ctxAccessToken: null,
    ctxUserData: {},
});

export function AuthCtxProvider(props) {
    const [ctxAccessToken, setCtxAccessToken] = useState(null);
    const [ctxUserData, setCtxUserData] = useState({});
    const [ctxAuthLoading, setCtxAuthLoading] = useState(true);

    useEffect(() => {
        configureApiClient({
            tokenGetter: () => ctxAccessToken,
            unauthorizedHandler: () => {
                setCtxAccessToken(null);
                setCtxUserData({});
            },
        });
    }, [ctxAccessToken]);

    useEffect(() => {
        let isMounted = true;

        const getUserData = async () => {
            try {
                await api.post("/api/auth/refresh/", {}, { authRequired: false });
                const profile = await api.get("/api/profile/");
                if (!isMounted) {
                    return;
                }
                setCtxUserData(profile || {});
                setCtxAccessToken("cookie-session");
            } catch {
                if (isMounted) {
                    setCtxAccessToken(null);
                    setCtxUserData({});
                }
            } finally {
                if (isMounted) {
                    setCtxAuthLoading(false);
                }
            }
        };

        getUserData();

        return () => {
            isMounted = false;
        };
    }, []);

    const context = {
        ctxAccessToken,
        setCtxAccessToken,
        ctxUserData,
        setCtxUserData,
        ctxAuthLoading,
    };

    return <AuthCtx.Provider value={context}>{props.children}</AuthCtx.Provider>;
}

export default AuthCtx;
