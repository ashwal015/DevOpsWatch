import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await api.post("/register", { email, password });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            if (err.response?.status === 400) {
                setError("Email already registered");
            } else {
                setError("Something went wrong, try again");
            }
        }
    }

    return (
        <div style={{ maxWidth: 320, margin: "80px auto" }}>
            <h2>Register</h2>

            {success ? (
                <p style={{ color: "green" }}>Account created! Redirecting to login...</p>
            ) : (
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
                        minLength={6}
                        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit" style={{ width: "100%", padding: 8 }}>
                        Register
                    </button>
                </form>
            )}

            <p style={{ marginTop: 15 }}>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default Register;