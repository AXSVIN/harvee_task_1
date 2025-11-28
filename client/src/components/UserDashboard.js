import React, { useEffect, useState } from "react";
import axios from "axios";

// Simple goBack function
const goBack = () => window.history.back();

// Profile icon logic
const getProfileIcon = (user) => {
  const role = user.role ? user.role.toLowerCase() : '';
  const nameInitial = user.name ? user.name.charAt(0).toUpperCase() : '';

  if (role === 'admin') return '👑';
  if (['M', 'J', 'T'].includes(nameInitial)) return '👨';
  if (['A', 'S', 'E'].includes(nameInitial)) return '👩';
  return '👤';
};

// Inline styles
const inlineStyles = {
  dashboardContainer: {
    padding: '20px 30px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backButton: {
    padding: '10px 15px',
    marginBottom: '25px',
    cursor: 'pointer',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  backButtonHover: { backgroundColor: '#357abd' },
  header: { color: '#333', marginBottom: '10px' },
  subText: { color: '#666', marginBottom: '30px', fontSize: '14px' },
  profileImage: { borderRadius: '50%', objectFit: 'cover', border: '2px solid #4a90e2' },
  profileIcon: { fontSize: '24px' },
};

// Responsive table styles
const getResponsiveStyles = () => `
.user-table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; border: 1px solid #dee2e6; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.user-table th { padding: 15px 10px; border-bottom: 2px solid #dee2e6; font-weight: bold; color: #495057; text-transform: uppercase; font-size: 12px; background: #f8f9fa; text-align: left; }
.user-table td { padding: 12px 10px; border-bottom: 1px solid #dee2e6; vertical-align: middle; color: #343a40; font-size: 14px; transition: background-color 0.2s; }
.user-table tbody tr:nth-child(even) { background: #f9f9f9; }
.user-table tbody tr:hover { background-color: #e9ecef; cursor: default; }
.user-table .center-text { text-align: center; }

@media screen and (max-width: 768px) {
  .user-table thead { border: none; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
  .user-table tr { display: block; margin-bottom: 15px; border: 1px solid #dee2e6; border-radius: 8px; }
  .user-table td { display: block; text-align: right; border-bottom: 1px solid #f0f0f0; padding-left: 50%; position: relative; }
  .user-table td::before { content: attr(data-label); position: absolute; left: 10px; width: 45%; padding-right: 10px; white-space: nowrap; text-align: left; font-weight: bold; color: #495057; }
  .user-table tr td:last-child { border-bottom: 0; }
  .user-table tbody tr:nth-child(even) { background: #fff; }
}
`;

function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  return (
    <div style={inlineStyles.dashboardContainer}>
      <style dangerouslySetInnerHTML={{ __html: getResponsiveStyles() }} />
      <button
        onClick={goBack}
        style={hoveredRow === 'back' ? {...inlineStyles.backButton, ...inlineStyles.backButtonHover} : inlineStyles.backButton}
        onMouseEnter={() => setHoveredRow('back')}
        onMouseLeave={() => setHoveredRow(null)}
      >
        ← Back
      </button>

      <h1 style={inlineStyles.header}>User Dashboard</h1>
      <p style={inlineStyles.subText}>You can only view users — editing and deleting are disabled.</p>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Role</th>
            <th className="center-text">Profile</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} onMouseEnter={() => setHoveredRow(u._id)} onMouseLeave={() => setHoveredRow(null)}>
              <td data-label="Name">{u.name}</td>
              <td data-label="Email">{u.email}</td>
              <td data-label="Phone">{u.phone}</td>
              <td data-label="City">{u.city}</td>
              <td data-label="Role">{u.role}</td>
              <td data-label="Profile" className="center-text">
                {u.profile_image ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${u.profile_image}`}
                    width="40"
                    height="40"
                    style={inlineStyles.profileImage}
                    alt={`${u.name}'s profile`}
                  />
                ) : (
                  <span role="img" aria-label="profile icon" style={inlineStyles.profileIcon}>
                    {getProfileIcon(u)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserDashboard;
