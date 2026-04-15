// api client module (example)
import { BASE_URL } from "./constants";

class ApiError extends Error {
    constructor({ message, status = 0, details = null, method, url }) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
        this.method = method;
        this.url = url;
    }
}

let getAccessToken = () => null;
let onUnauthorized = () => {};

export function configureApiClient({ tokenGetter, unauthorizedHandler }) {
    getAccessToken = tokenGetter || (() => null);
    onUnauthorized = unauthorizedHandler || (() => {});
}

function buildUrl(path, query) {
    const url = new URL(`${BASE_URL}${path}`);
    if (query) {
        Object.entries(query).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "") url.searchParams.append(k, String(v));
        });
    }
    return url.toString();
}

function getCookie(name) {
    if (typeof document === "undefined") {
        return null;
    }

    const escapedName = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function shouldAttachCsrf(method) {
    return !["GET", "HEAD", "OPTIONS", "TRACE"].includes(String(method).toUpperCase());
}

async function request({ method = "GET", path, query, body, authRequired = true, signal, _retried = false }) {
    const url = buildUrl(path, query);
    const headers = { "Content-Type": "application/json" };

    if (authRequired && getAccessToken()) {
        // Cookie auth is used; tokenGetter now acts only as authenticated-session marker.
    }

    if (shouldAttachCsrf(method)) {
        const csrfToken = getCookie("csrftoken");
        if (csrfToken) {
            headers["X-CSRFToken"] = csrfToken;
        }
    }

    let res;
    try {
        res = await fetch(url, {
            method,
            headers,
            credentials: "include",
            body: body ? JSON.stringify(body) : undefined,
            signal,
        });
    } catch {
        throw new ApiError({ message: "Network error. Please try again.", method, url });
    }

    if (res.status === 401 && authRequired && !_retried && !path.includes("/api/auth/refresh/")) {
        try {
            await request({
                method: "POST",
                path: "/api/auth/refresh/",
                body: {},
                authRequired: false,
                signal,
                _retried: true,
            });

            return request({ method, path, query, body, authRequired, signal, _retried: true });
        } catch {
            onUnauthorized();
        }
    }

    if (res.status === 401) {
        onUnauthorized();
    }

    if (res.status === 204) return null;

    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await res.json() : await res.text();

    if (!res.ok) {
        const message =
            (payload && payload.detail) ||
            (typeof payload === "string" && payload) ||
            `Request failed with status ${res.status}`;
        throw new ApiError({
            message,
            status: res.status,
            details: payload,
            method,
            url,
        });
    }

    return payload;
}

export const api = {
    get: (path, opts = {}) => request({ ...opts, method: "GET", path }),
    post: (path, body, opts = {}) => request({ ...opts, method: "POST", path, body }),
    put: (path, body, opts = {}) => request({ ...opts, method: "PUT", path, body }),
    patch: (path, body, opts = {}) => request({ ...opts, method: "PATCH", path, body }),
    delete: (path, opts = {}) => request({ ...opts, method: "DELETE", path }),
};

export { ApiError };
