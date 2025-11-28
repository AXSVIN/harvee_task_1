import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// --- Style Definitions ---
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f7f6",
        fontFamily: "Arial, sans-serif",
    },
    loginBox: {
        padding: "40px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "300px",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "8px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px 15px",
        margin: "10px 0",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        width: "100%",
        fontSize: "16px",
        transition: 'background-color 0.3s',
    },
    disabledButton: { // Style for disabled state
        backgroundColor: "#a0cfff", 
        cursor: 'not-allowed',
    },
    link: {
        color: "#007bff",
        textDecoration: "none",
        fontWeight: "bold",
    },
    errorMessage: { // NEW STYLE
        color: '#d9534f', 
        backgroundColor: '#f2dede',
        border: '1px solid #ebccd1',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
        fontSize: '14px',
    },
};
// -------------------------

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); // NEW
    const [error, setError] = useState(null); // NEW
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/auth/login`,
                { email, password }
            );

            // Save token + role
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);

            // Clear password state for security
            setPassword(""); 

            // Redirect by role
            if (res.data.role === "admin") navigate("/admin-dashboard");
            else navigate("/user-dashboard");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login failed due to a server error.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    
                    {error && <p style={styles.errorMessage}>❌ {error}</p>}
                    
                    <input
                        type="email"
                        placeholder="Email"
                        value={email} // Controlled input
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password} // Controlled input
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />

                    <button 
                        type="submit" 
                        style={{ ...styles.button, ...(isLoading ? styles.disabledButton : {}) }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging In..." : "Login"}
                    </button>
                </form>

                <p>
                    New user?{" "}
                    <Link to="/register" style={styles.link}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;