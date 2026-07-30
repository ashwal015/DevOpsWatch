import { Link } from "react-router-dom";

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