import { Bounce, toast } from "react-toastify";

export default function MessageError(error) {
    const message = error || "Erro inesperado.";
    toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
    });
}
