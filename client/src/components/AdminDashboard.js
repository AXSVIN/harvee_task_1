import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
// Removed: import AddUserForm from './AddUserForm';

// --- NEW Light Blue / Light Green Style Definitions ---
const colors = {
    // Original: primary: '#47699F', // Deep Blue / Indigo
    primary: '#4DA6FF', // Light/Sky Blue - Main Accent
    // Original: secondary: '#D7DDE3',
    secondary: '#E0F2F1', // Very light mint/cyan - Light Background/Hover
    // Original: success: '#10A050', // Brighter Green
    success: '#66BB6A', // Soft Light Green - Action/Success
    // Original: warning: '#F5A623', // Amber/Yellow
    warning: '#FFEE58', // Light Yellow
    // Original: danger: '#E53935', // Red
    danger: '#FF7043', // Soft Red/Coral
    textDark: '#333',
    textLight: '#ffffff',
    // Original: background: '#f4f7f6', // Light gray background
    background: '#F8FDFF', // Near white, very subtle light blue tint
    cardBackground: '#ffffff',
};

const styles = {
    // General Layout
    container: {
        padding: "40px",
        fontFamily: "Roboto, 'Segoe UI', Arial, sans-serif",
        backgroundColor: colors.background,
        minHeight: "100vh",
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: "30px",
        paddingBottom: "15px",
    },
    title: {
        color: colors.textDark,
        margin: 0,
        fontSize: '28px',
        fontWeight: 500,
    },
    // --- Dashboard Card Styles ---
    dashboardCardContainer: {
        display: 'flex',
        gap: '20px', // Space between cards
        marginBottom: '30px',
        flexWrap: 'wrap', // Responsive layout
    },
    card: {
        flex: 1, // Distribute space equally (col-6/50% width)
        minWidth: '250px', // Minimum width for responsiveness
        padding: '25px',
        backgroundColor: colors.cardBackground,
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: '16px',
        color: colors.textDark,
        marginBottom: '5px',
        fontWeight: 400,
    },
    cardValue: {
        fontSize: '32px',
        fontWeight: 600,
        color: colors.primary, // Using light blue for primary value
    },
    cardIcon: {
        fontSize: '40px',
        color: colors.secondary,
    },
    // Main Green Action Button 
    actionButton: { 
        padding: "12px 25px",
        backgroundColor: colors.success, // Light green
        color: colors.textLight,
        borderRadius: "8px", // Softer corners
        cursor: "pointer",
        border: "none",
        fontWeight: "bold",
        fontSize: "16px",
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: "all 0.3s ease",
        textDecoration: 'none', // For link style usage
    },
    backButton: { // Style for the Back button/link
        color: colors.primary,
        textDecoration: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        padding: '8px 15px',
        border: `1px solid ${colors.primary}`,
        borderRadius: '4px',
        backgroundColor: colors.cardBackground,
        marginRight: '15px',
        fontWeight: 'normal',
    },
    
    // Table Styles
    responsiveTableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", // Deeper shadow for premium feel
        backgroundColor: colors.cardBackground,
        borderRadius: '8px',
        overflow: 'hidden', // Ensures shadow and border radius apply nicely
        minWidth: '900px', // Slightly wider for better content display
    },
    tableHeader: {
        backgroundColor: colors.primary, // Light blue header
        color: colors.textLight,
        textAlign: "left",
        fontWeight: 600,
    },
    tableRow: {
        borderBottom: `1px solid ${colors.secondary}`,
        transition: "background-color 0.2s",
    },
    tableRowHover: {
        backgroundColor: colors.secondary, // Very light mint/cyan hover
    },
    tableCell: {
        padding: "15px 12px", // Increased padding
        verticalAlign: "middle",
        color: colors.textDark,
        fontSize: '14px',
    },
    
    // Action Button Styles (Table)
    button: {
        padding: "8px 12px",
        borderRadius: "4px",
        cursor: "pointer",
        border: "none",
        fontWeight: "bold",
        transition: "background-color 0.2s",
        marginRight: "8px",
        fontSize: '12px',
    },
    editButton: {
        backgroundColor: colors.warning, // Light Yellow
        color: colors.textDark,
    },
    deleteButton: {
        backgroundColor: colors.danger, // Soft Red/Coral
        color: colors.textLight,
    },
    
    // --- Modal Styles ---
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: colors.cardBackground,
        padding: '30px',
        borderRadius: '12px', // Rounder modal
        width: '450px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)', // Stronger shadow
    },
    modalInput: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        border: `1px solid ${colors.secondary}`,
        borderRadius: '6px',
        boxSizing: 'border-box',
        fontSize: '15px',
    },
    modalTitle: {
        borderBottom: `2px solid ${colors.secondary}`,
        paddingBottom: '15px',
        marginBottom: '20px',
        color: colors.primary, // Light blue title
        fontSize: '22px',
    },
    
    // Circular Profile Image Placeholder/Preview
    profileImageContainer: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: colors.secondary,
        border: '2px dashed #999',
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
        color: '#666',
        fontSize: '0.8em',
        textAlign: 'center',
        padding: '10px',
    },
};
// -------------------------


function AdminDashboard() {
    // Simplified state to just manage the dashboard view
    // eslint-disable-next-line no-unused-vars
    const [currentView, setCurrentView] = useState('dashboard'); 
    
    const [users, setUsers] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    // Initializing password to empty string for security when modal opens
    const [formData, setFormData] = useState({ password: '' }); 

    // Mock API Base URL - REPLACE with your actual environment variable or config
   const API_BASE_URL = process.env.REACT_APP_API_URL;


    useEffect(() => { 
        // Always fetch users on mount since we are only in the 'dashboard' view
        fetchUsers(); 
    }, []); 

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/users`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setUsers(res.data);
        } catch (err) {
            alert("Failed to load users. Check console for details.");
            console.error(err);
        }
    };
    
    // --- Calculate User Counts using useMemo ---
    const userCounts = useMemo(() => {
        const counts = { admin: 0, user: 0 };
        users.forEach(u => {
            if (u.role === 'admin') {
                counts.admin++;
            } else if (u.role === 'user') {
                counts.user++;
            }
        });
        return counts;
    }, [users]); // Recalculate whenever the users array changes

    // --- EDIT & DELETE LOGIC ---
    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE_URL}/api/users/${id}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setUsers(users.filter(u => u._id !== id));
            alert("User deleted successfully!");
        } catch (err) {
            alert("Delete failed.");
            console.error(err);
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        // Initialize formData with user details, set profile_image to null to handle multipart upload logic, and reset password
        setFormData({ ...user, profile_image: null, password: '' }); 
        setIsEditModalOpen(true);
    };

    const handleModalChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profile_image" && files && files.length > 0) {
            setFormData({ ...formData, profile_image: files[0] });
        } else if (name !== "profile_image") {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const updateData = new FormData();
        
        Object.keys(formData).forEach(key => {
            // Skip Mongoose internal keys
            if (key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') return;
            
             // Only append profile_image if a new File object has been selected
            if (key === 'profile_image') {
                 if (formData[key] instanceof File) {
                     updateData.append(key, formData[key]);
                 }
                 return; // Skip if it's null (no change) or a string (old filename)
            }
            
            // Only append password if the user typed a value (i.e., changing it)
            if (key === 'password') {
                if (formData[key]) {
                    updateData.append(key, formData[key]);
                }
                return;
            }
            
            // Append all other fields
            // NOTE: It's important to send *all* non-file, non-password fields to ensure they are explicitly updated or preserved on the server side if using a PUT request.
            if (formData[key] !== null && formData[key] !== undefined) { 
                updateData.append(key, formData[key]);
            }
        });

        try {
            // Because we are sending FormData, we do not need to manually set the Content-Type to multipart/form-data. Axios and the browser handle this.
            await axios.put(`${API_BASE_URL}/api/users/${editingUser._id}`, updateData, { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                } 
            });
            
            alert("User updated successfully!");
            setIsEditModalOpen(false); 
            fetchUsers(); 
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
            console.error(err.response?.data || err);
        }
    };
    
    const getProfileImageSrc = () => {
        // 1. New file preview
        if (formData.profile_image instanceof File) {
            return URL.createObjectURL(formData.profile_image);
        }
        // 2. Existing image from server
        if (editingUser?.profile_image) {
            return `${API_BASE_URL}/uploads/${editingUser.profile_image}`;
        }
        return null; 
    };

    const triggerFileInput = () => {
        document.getElementById('modal_profile_image_input').click();
    };

    // --- RENDER ---
    return (
        <div style={styles.container}>
            
            <div style={styles.headerRow}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 style={styles.title}>
                        👤 Admin Management 
                    </h1>
                </div>
            </div>
            
            <hr style={{ border: 'none', height: '1px', backgroundColor: colors.secondary, margin: '0 0 30px 0' }} />
            
            {/* --- Dashboard Count Cards --- */}
            <div style={styles.dashboardCardContainer}>
                {/* Admin Count Card */}
                <div style={styles.card}>
                    <div>
                        {/* Using Light Green for Admin Card */}
                        <div style={{...styles.cardValue, color: colors.success }}>{userCounts.admin}</div> 
                        <div style={styles.cardTitle}>Total Admins</div>
                    </div>
                    {/* Icon for Admin (e.g., a shield or crown) */}
                    <span style={{...styles.cardIcon, color: colors.success}}>🛡️</span>
                </div>

                {/* User Count Card */}
                <div style={styles.card}>
                    <div>
                        {/* Using Light Blue for User Card */}
                        <div style={{...styles.cardValue, color: colors.primary }}>{userCounts.user}</div> 
                        <div style={styles.cardTitle}>Total Users</div>
                    </div>
                    {/* Icon for User (e.g., a simple person) */}
                    <span style={{...styles.cardIcon, color: colors.primary}}>👥</span>
                </div>
            </div>

            
            {/* Dashboard Table View */}
            <div style={styles.responsiveTableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.tableCell}>Name</th>
                            <th style={styles.tableCell}>Email</th>
                            <th style={styles.tableCell}>Phone</th>
                            <th style={styles.tableCell}>City</th>
                            <th style={styles.tableCell}>Role</th>
                            <th style={styles.tableCell}>Image</th>
                            <th style={styles.tableCell}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ ...styles.tableCell, textAlign: 'center', color: '#666' }}>
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map(u => (
                                <tr 
                                    key={u._id} 
                                    style={styles.tableRow} 
                                    // Dynamic hover effect using inline styles
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.cardBackground}
                                >
                                    <td style={styles.tableCell}>{u.name}</td>
                                    <td style={styles.tableCell}>{u.email}</td>
                                    <td style={styles.tableCell}>{u.phone || 'N/A'}</td>
                                    <td style={styles.tableCell}>{u.city || 'N/A'}</td>
                                    <td style={styles.tableCell}>{u.role}</td>
                                    <td style={styles.tableCell}>
                                        {u.profile_image ? (
                                            <img 
                                                src={`${API_BASE_URL}/uploads/${u.profile_image}`} 
                                                alt="Profile" 
                                                width="50" 
                                                height="50" 
                                                style={{ borderRadius: "50%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <span style={{ color: '#aaa' }}>No Image</span>
                                        )}
                                    </td>
                                    <td style={styles.tableCell}>
                                        <button 
                                            onClick={() => openEditModal(u)} 
                                            style={{ ...styles.button, ...styles.editButton }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteUser(u._id)} 
                                            style={{ ...styles.button, ...styles.deleteButton }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            {/* --- EDIT MODAL --- */}
            {isEditModalOpen && editingUser && (
                <div style={styles.modalBackdrop} onClick={() => setIsEditModalOpen(false)}>
                    {/* Prevent click inside modal from closing it */}
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Edit User: {editingUser.name}</h2>
                        <form onSubmit={handleUpdate}>
                            
                            {/* Circular Image Placeholder/Preview */}
                            <div
                                style={{
                                    ...styles.profileImageContainer,
                                    backgroundImage: getProfileImageSrc() ? `url(${getProfileImageSrc()})` : 'none',
                                    borderColor: getProfileImageSrc() ? colors.primary : '#999'
                                }}
                                onClick={triggerFileInput} 
                            >
                                {!getProfileImageSrc() && (
                                    <span style={styles.profileImagePlaceholderText}>
                                        Click to change <br /> profile image
                                    </span>
                                )}
                            </div>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                name="profile_image"
                                id="modal_profile_image_input"
                                accept="image/*"
                                onChange={handleModalChange}
                                style={{ display: 'none' }}
                            /><br/>
                            
                            <input name="name" placeholder="Full Name" value={formData.name || ''} onChange={handleModalChange} required style={styles.modalInput} />
                            <input name="email" type="email" placeholder="Email Address" value={formData.email || ''} onChange={handleModalChange} required style={styles.modalInput} />
                            
                            {/* Password field for security (optional change) */}
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Change Password (Leave blank to keep current)" 
                                value={formData.password || ''} 
                                onChange={handleModalChange} 
                                style={styles.modalInput} 
                            />
                            
                            <input name="phone" placeholder="Phone Number" value={formData.phone || ''} onChange={handleModalChange} style={styles.modalInput} />
                            <input name="address" placeholder="Address Line" value={formData.address || ''} onChange={handleModalChange} style={styles.modalInput} />
                            
                            <input name="city" placeholder="City" value={formData.city || ''} onChange={handleModalChange} style={styles.modalInput} />
                            <input name="state" placeholder="State/Province" value={formData.state || ''} onChange={handleModalChange} style={styles.modalInput} />
                            <input name="country" placeholder="Country" value={formData.country || ''} onChange={handleModalChange} style={styles.modalInput} />
                            <input name="pincode" placeholder="Pincode/ZIP" value={formData.pincode || ''} onChange={handleModalChange} style={styles.modalInput} />

                            <label style={{ display: 'block', textAlign: 'left', marginTop: '10px', color: colors.textDark }}>Role:</label>
                            <select name="role" value={formData.role || 'user'} onChange={handleModalChange} style={styles.modalInput}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>

                            <button type="submit" style={{ ...styles.button, backgroundColor: colors.primary, color: colors.textLight, marginTop: '20px', width: '100%', padding: '12px', fontSize: '16px', marginRight: 0 }}>
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsEditModalOpen(false)} 
                                style={{ 
                                    ...styles.button, 
                                    backgroundColor: colors.secondary, 
                                    color: colors.textDark, 
                                    marginTop: '10px', 
                                    width: '100%', 
                                    padding: '12px', 
                                    fontSize: '16px', 
                                    marginRight: 0 
                                }}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default AdminDashboard;