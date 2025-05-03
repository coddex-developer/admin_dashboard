import { useState } from "react";
import "./styles.min.css";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function userLogin(e) {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/login", {
                userAdmin: username,
                password: password
            });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                window.location.href = "/dashboard";
            }

        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return toast(`${message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                type: "error",
                closeButton: true,
                pauseOnFocusLoss: true,
                transition: Bounce,
            });

        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                limit={2}
                transition={Bounce}
                stacked 
            />
            <div className="login-container">
                <form className="form-login" onSubmit={userLogin}>
                <h1 className="title-login">Admin</h1>
                    <label htmlFor="userAdmin">Username:</label>
                    <input
                        type="text"
                        id="userAdmin"
                        name="userAdmin"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="login-button" type="submit">Login</button>
                </form>
            </div>
        </>
    );
}
