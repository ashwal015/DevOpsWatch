import { Link } from "react-router-dom";
import { colors } from "../theme";

function NavBar({ token, onLogout }) {
    const linkStyle = {
        marginRight: 16,
        textDecoration: "none",
        color: "#ccc",
    };

    return (
        <nav
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 24px",
                borderBottom: "1px solid #333",
                marginBottom: 20,
            }}
        >
            <span style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 24 }}>
                <svg width="20" height="20" viewBox="0 0 64 64">
                    <rect width="64" height="64" rx="12" fill="#0d0e12" />
                    <polyline points="8,34 18,34 23,22 28,42 33,34 44,34 49,28 54,34 56,34" fill="none" stroke="#4a9eff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="56" cy="34" r="3" fill="#2ecc71" />
                </svg>
                <span style={{ fontWeight: 600, color: colors.text }}>DevOpsWatch</span>
            </span>
            <div>
                <Link to="/status" style={linkStyle}>Status</Link>
                {token ? (
                    <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/register" style={linkStyle}>Register</Link>
                    </>
                )}
            </div>
            {token && (
                <button onClick={onLogout} style={{ padding: "6px 12px" }}>
                    Log out
                </button>
            )}
        </nav>
    );
}

export default NavBar;