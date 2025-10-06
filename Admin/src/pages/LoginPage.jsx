import React, { useState } from "react";
import axios from "axios";

// Placeholder background image
const backgroundImage = "https://res.cloudinary.com/dmranuiwo/image/upload/v1757076175/coff_to94lp.png";

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);
        setIsSubmitting(true);

        const backendUrl = "http://localhost:3001";

        try {
            // ✅ Updated URL to match backend
            const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

            if (response.data.token) {
                const userRole = response.data.user.role;

                if (userRole !== "admin") {
                    setIsError(true);
                    setMessage("Access denied: Admins only.");
                    setIsSubmitting(false);
                    return;
                }

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", response.data.user.username);
                localStorage.setItem("userRole", userRole);

                if (onLogin) {
                    onLogin(response.data.token);
                }

                setMessage("Login successful");
            } else {
                setIsError(true);
                setMessage("No token returned from server.");
            }
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@400;600&display=swap');

                .login-container {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-size: 100px auto;
                    background-position: center;
                    background-attachment: fixed;
                    font-family: 'Open Sans', sans-serif;
                    position: relative;
                }

                .login-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.4);
                    z-index: 1;
                }

                .login-form-box {
                    background-color: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    padding: 2.5rem;
                    border-radius: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
                    width: 90%;
                    max-width: 450px;
                    text-align: center;
                    z-index: 2;
                    animation: fadeIn 1s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .login-title {
                    font-family: 'Merriweather', serif;
                    font-size: 2.8rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 2.5rem;
                    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                }

                .input-group label {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    letter-spacing: 0.05em;
                }

                .input-group input {
                    padding: 1rem 1.25rem;
                    background-color: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 0.75rem;
                    color: #fff;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    outline: none;
                }

                .input-group input::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }

                .input-group input:focus {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.7);
                    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
                }

                .login-button {
                    width: 100%;
                    padding: 1.2rem;
                    background: linear-gradient(145deg, #6F4E37, #A0522D);
                    color: #fff;
                    font-size: 1.2rem;
                    font-weight: 700;
                    border: none;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }

                .login-button:hover:not(:disabled) {
                    background: linear-gradient(145deg, #A0522D, #6F4E37);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
                }

                .login-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .message-box {
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .success-message {
                    background-color: rgba(40, 167, 69, 0.8);
                    color: #fff;
                }

                .error-message {
                    background-color: rgba(220, 53, 69, 0.8);
                    color: #fff;
                }

                .links-container {
                    margin-top: 1.5rem;
                }

                .signup-link {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 1rem;
                    cursor: pointer;
                    text-decoration: none;
                    transition: color 0.3s ease, text-decoration 0.3s ease;
                }

                .signup-link:hover {
                    color: #fff;
                    text-decoration: underline;
                }

                @media (max-width: 640px) {
                    .login-form-box { padding: 2rem; }
                    .login-title { font-size: 2.2rem; }
                    .input-group label { font-size: 1rem; }
                    .login-button { font-size: 1.1rem; padding: 1rem; }
                    .message-box, .signup-link { font-size: 0.9rem; }
                }
                `}
            </style>

            <div className="login-form-box">
                <h1 className="login-title">Admin Login</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    {message && (
                        <p className={`message-box ${isError ? "error-message" : "success-message"}`}>
                            {message}
                        </p>
                    )}
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="login-button">
                        {isSubmitting ? "Processing..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
