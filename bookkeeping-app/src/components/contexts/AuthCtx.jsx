import { createContext, useState, useEffect } from "react";
import { BASE_URL } from "../../constants";

const AuthCtx = createContext({
    ctxAccessToken: null,
    ctxUserData: null,
});

export function AuthCtxProvider(props) {
    const [ctxAccessToken, setCtxAccessToken] = useState(localStorage.getItem("accessToken"));
    const [ctxUserData, setCtxUserData] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            if (!ctxAccessToken) {
                setCtxUserData(null);
                return;
            }
            const response = await fetch(`${BASE_URL}/api/profile/`, {
                headers: { Authorization: `Bearer ${ctxAccessToken}` },
            });
            if (response.ok) setCtxUserData(await response.json());
            else setCtxUserData(null);
        };
        getUserData();
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
