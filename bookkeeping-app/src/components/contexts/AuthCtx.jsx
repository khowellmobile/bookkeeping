import { createContext, useState } from "react";

const AuthCtx = createContext({
    ctxAccessToken: null,
    ctxUserData: null,
});

export function AuthCtxProvider(props) {
    const [ctxAccessToken, setCtxAccessToken] = useState(null);
    const [ctxUserData, setCtxUserData] = useState(null);

    const context = {
        ctxAccessToken,
        setCtxAccessToken,
        ctxUserData,
        setCtxUserData,
    };

    return <AuthCtx.Provider value={context}>{props.children}</AuthCtx.Provider>;
}

export default AuthCtx;
