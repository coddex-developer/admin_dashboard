import { jwtDecode } from "jwt-decode";
import MessageError from "./components/alerts/MessageError";

const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const { exp } = jwtDecode(token);
        return exp * 1000 > Date.now();
    } catch (error) {
        MessageError(error || "Token inválido ou expirado.");
    }
};

export default isAuthenticated;