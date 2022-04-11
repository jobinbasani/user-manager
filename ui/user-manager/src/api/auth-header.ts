
/** Get jwt access token from local storage */

export interface User {
    email: String;
    accessToken: String;
}

export const authHeader = () => {
    const user: User = JSON.parse(localStorage.getItem("user") || "");

    if (user && user.accessToken) {
        return {"bearer-token": user.accessToken};
    } else {
        return {};
    }
}