import { createContext } from "react";

const AuthCtx = createContext({});

export function AuthCtxProvider(props) {
    // Only keep context-specific values here, e.g. for global state or cross-component sharing
    return <AuthCtx.Provider value={{}}>{props.children}</AuthCtx.Provider>;
}

export default AuthCtx;
