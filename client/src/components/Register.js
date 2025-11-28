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
    registerBox: {
        padding: "40px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "400px",
        textAlign: "center",
        maxHeight: "90vh",
        overflowY: "auto",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "8px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
    },
    profileImageContainer: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#e0e0e0',
        border: '2px dashed #bbb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 20px auto',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'border-color 0.3s ease',
    },
    profileImagePlaceholderText: {
        color: '#888',
        fontSize: '0.8em',
        textAlign: 'center',
        padding: '10px',
    },
    button: {
        backgroundColor: "#28a745",
        color: "white",
        padding: "12px 15px",
        margin: "15px 0 5px 0",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        width: "100%",
        fontSize: "16px",
        fontWeight: "bold",
        transition: "background-color 0.3s",
    },
    disabledButton: { // New disabled style
        backgroundColor: '#6c757d',
        cursor: 'not-allowed',
        opacity: 0.7,
    },
    errorMessage: { // New error style
        color: '#d9534f',
        backgroundColor: '#f2dede',
        border: '1px solid #ebccd1',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
        fontSize: '14px',
    },
    link: {
        color: "#007bff",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "14px",
    }
};

function Register() {
    const [data, setData] = useState({});
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // NEW
    const [error, setError] = useState(null); // NEW
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === "profile_image") {
            const file = e.target.files[0];
            setData({ ...data, profile_image: file });
            if (file) setProfileImagePreview(URL.createObjectURL(file));
            else setProfileImagePreview(null);
        } else {
            setData({ ...data, [e.target.name]: e.target.value });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        setError(null);
        
        // Basic frontend validation example
        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                // IMPORTANT: Skip confirmPassword when building FormData for the API
                if (key !== 'confirmPassword') {
                    formData.append(key, data[key]);
                }
            });

            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);

            alert("Registered Successfully! You can now log in.");
            navigate("/login");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration Failed due to a server error.";
            setError(errorMessage);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const triggerFileInput = () => {
        document.getElementById('profile_image').click();
    };

    return (
        <div style={styles.container}>
            <div style={styles.registerBox}>
                <h2>Create Account</h2>
                <form onSubmit={handleRegister}>
                    
                    {/* Image Upload/Preview Section (Unchanged) */}
                    <div
                        style={{
                            ...styles.profileImageContainer,
                            backgroundImage: profileImagePreview ? `url(${profileImagePreview})` : 'none',
                            borderColor: profileImagePreview ? '#28a745' : '#bbb'
                        }}
                        onClick={triggerFileInput}
                    >
                        {!profileImagePreview && (
                            <span style={styles.profileImagePlaceholderText}>
                                Click to upload <br /> profile image
                            </span>
                        )}
                    </div>
                    
                    <input
                        type="file"
                        name="profile_image"
                        id="profile_image"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    /><br/>
                    
                    {/* NEW: Error Display */}
                    {error && <p style={styles.errorMessage}>🛑 {error}</p>}

                    {/* Form Fields */}
                    <input name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} /><br/>
                    <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required style={styles.input} /><br/>
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={styles.input} /><br/>
                    
                    {/* NEW: Confirm Password Field for UX validation */}
                    <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required style={styles.input} /><br/>
                    
                    {/* Optional Fields */}
                    <input name="phone" placeholder="Phone Number" onChange={handleChange} style={styles.input} /><br/>
                    <input name="address" placeholder="Address Line" onChange={handleChange} style={styles.input} /><br/>
                    <input name="city" placeholder="City" onChange={handleChange} style={styles.input} /><br/>
                    <input name="state" placeholder="State/Province" onChange={handleChange} style={styles.input} /><br/>
                    <input name="country" placeholder="Country" onChange={handleChange} style={styles.input} /><br/>
                    <input name="pincode" placeholder="Pincode/ZIP" onChange={handleChange} style={styles.input} /><br/>
                    
                    <button 
                        type="submit" 
                        style={{ ...styles.button, ...(isLoading ? styles.disabledButton : {}) }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;