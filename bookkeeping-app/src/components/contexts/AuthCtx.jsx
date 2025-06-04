import { createContext, useState } from "react";

const AuthCtx = createContext({
    ctxAccessToken: null,
    setCtxAccessToken: () => {},
    logoutUser: () => {},
});

export function AuthCtxProvider(props) {
    const [ctxAccessToken, setCtxAccessToken] = useState(localStorage.getItem("accessToken") || null);

    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        setCtxAccessToken(null);
    };

    const context = {
        ctxAccessToken,
        setCtxAccessToken,
        logoutUser,
    };

    return <AuthCtx.Provider value={context}>{props.children}</AuthCtx.Provider>;
}

export default AuthCtx;
