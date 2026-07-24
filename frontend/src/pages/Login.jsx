import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../api";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await api.post("/login", { email, password });
            const token = res.data.access_token;
            setAuthToken(token);
            onLogin(token);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        }
    }

    return (
        <div style={{ maxWidth: 320, margin: "80px auto" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" style={{ width: "100%", padding: 8 }}>
                    Log In
                </button>
            </form>
            <p style={{ marginTop: 15 }}>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;