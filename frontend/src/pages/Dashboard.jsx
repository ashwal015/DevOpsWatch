import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const statusStyles = {
    open: { bg: "#3b3410", color: "#f5c518", label: "INVESTIGATING" },
    in_progress: { bg: "#123a2e", color: "#2ecc71", label: "IN PROGRESS" },
    closed: { bg: "#1a2e1a", color: "#7fbf7f", label: "RESOLVED" },
};

const severityStyles = {
    low: { bg: "#2a2a2a", color: "#aaa" },
    medium: { bg: "#3a2a10", color: "#e5a02e" },
    critical: { bg: "#3a1414", color: "#e55353" },
};

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function Dashboard() {
    const [incidents, setIncidents] = useState([]);
    const [title, setTitle] = useState("");
    const [severity, setSeverity] = useState("low");
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState("open");
    const [showForm, setShowForm] = useState(false);

    async function loadIncidents() {
        const res = await api.get("/incidents");
        setIncidents(res.data);
    }

    useEffect(() => {
        loadIncidents();
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        await api.post("/incidents", { title, severity });
        setTitle("");
        setShowForm(false);
        loadIncidents();
    }

    const filtered = incidents
        .filter((inc) => (tab === "open" ? inc.status !== "closed" : true))
        .filter((inc) => inc.title.toLowerCase().includes(search.toLowerCase()));

    const tabStyle = (active) => ({
        marginRight: 24,
        paddingBottom: 8,
        cursor: "pointer",
        color: active ? "#4a9eff" : "#999",
        borderBottom: active ? "2px solid #4a9eff" : "2px solid transparent",
        fontWeight: active ? 600 : 400,
    });

    return (
        <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, margin: 0 }}>Incidents</h1>
                <input
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "#1a1a1a", color: "#eee", width: 200 }}
                />
            </div>

            {/* Tabs + Create button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", marginBottom: 16 }}>
                <div style={{ display: "flex" }}>
                    <div style={tabStyle(tab === "open")} onClick={() => setTab("open")}>Open</div>
                    <div style={tabStyle(tab === "all")} onClick={() => setTab("all")}>All Incidents</div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: 6, fontWeight: 600, cursor: "pointer", marginBottom: 10 }}
                >
                    {showForm ? "Cancel" : "Create incident"}
                </button>
            </div>

            {/* Create form (toggle) */}
            {showForm && (
                <form onSubmit={handleCreate} style={{ marginBottom: 20, padding: 16, border: "1px solid #333", borderRadius: 8 }}>
                    <input
                        placeholder="Incident title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ marginRight: 8, padding: 8, width: "50%" }}
                    />
                    <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ marginRight: 8, padding: 8 }}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="critical">Critical</option>
                    </select>
                    <button type="submit" style={{ padding: "8px 16px" }}>Add</button>
                </form>
            )}

            {/* Incident list */}
            {filtered.length === 0 && (
                <p style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No incidents here.</p>
            )}

            {filtered.map((inc) => {
                const s = statusStyles[inc.status] || statusStyles.open;
                const sev = severityStyles[inc.severity] || severityStyles.low;
                return (
                    <div
                        key={inc.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px 0",
                            borderBottom: "1px solid #292929",
                        }}
                    >
                        <div>
                            <Link to={`/incidents/${inc.id}`} style={{ fontSize: 16, fontWeight: 600, color: "#eee", textDecoration: "none" }}>
                                {inc.title}
                            </Link>
                            <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                                <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
                                    {s.label}
                                </span>
                                <span style={{ background: sev.bg, color: sev.color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
                                    {inc.severity.toUpperCase()}
                                </span>
                                <span style={{ fontSize: 12, color: "#777" }}>
                                    {inc.status === "closed" ? "Resolved" : "Last updated"} {timeAgo(inc.created_at)}
                                </span>
                            </div>
                        </div>
                        <Link
                            to={`/incidents/${inc.id}`}
                            style={{
                                background: "#232323",
                                color: "#ddd",
                                padding: "8px 16px",
                                borderRadius: 6,
                                fontSize: 13,
                                textDecoration: "none",
                                border: "1px solid #333",
                            }}
                        >
                            {inc.status === "closed" ? "Write postmortem" : "Update"}
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}

export default Dashboard;