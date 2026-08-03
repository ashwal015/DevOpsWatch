import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { colors, statusStyles, severityStyles, card } from "../theme";

function timeAgo(dateStr) {
    const utcDateStr = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
    const diff = Math.floor((Date.now() - new Date(utcDateStr)) / 1000);
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
        const interval = setInterval(loadIncidents, 10000);
        return () => clearInterval(interval);
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

    const openCount = incidents.filter((i) => i.status !== "closed").length;
    const criticalCount = incidents.filter((i) => i.severity === "critical" && i.status !== "closed").length;
    const resolvedCount = incidents.filter((i) => i.status === "closed").length;

    const tabStyle = (active) => ({
        marginRight: 28,
        paddingBottom: 10,
        cursor: "pointer",
        color: active ? colors.accent : colors.textMuted,
        borderBottom: active ? `2px solid ${colors.accent}` : "2px solid transparent",
        fontWeight: active ? 600 : 400,
        fontSize: 15,
    });

    const statCard = {
        ...card,
        padding: "18px 20px",
        marginBottom: 12,
    };

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, margin: 0, color: colors.text }}>Incidents</h1>
                <input
                    placeholder="Search incidents"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: colors.surface,
                        color: colors.text,
                        width: 240,
                        fontSize: 14,
                    }}
                />
            </div>

            {/* Two-column layout */}
            <div style={{ display: "flex", gap: 32 }}>
                {/* LEFT: main incident list */}
                <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: `1px solid ${colors.border}`,
                            marginBottom: 24,
                        }}
                    >
                        <div style={{ display: "flex" }}>
                            <div style={tabStyle(tab === "open")} onClick={() => setTab("open")}>Open</div>
                            <div style={tabStyle(tab === "all")} onClick={() => setTab("all")}>All Incidents</div>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                background: colors.accent,
                                color: "white",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                marginBottom: 12,
                            }}
                        >
                            {showForm ? "Cancel" : "Create incident"}
                        </button>
                    </div>

                    {showForm && (
                        <form
                            onSubmit={handleCreate}
                            style={{ ...card, padding: 24, marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}
                        >
                            <input
                                placeholder="Incident title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={{
                                    flex: 1,
                                    padding: 10,
                                    borderRadius: 8,
                                    border: `1px solid ${colors.border}`,
                                    background: colors.bg,
                                    color: colors.text,
                                }}
                            />
                            <select
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    border: `1px solid ${colors.border}`,
                                    background: colors.bg,
                                    color: colors.text,
                                }}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="critical">Critical</option>
                            </select>
                            <button
                                type="submit"
                                style={{
                                    background: colors.accent,
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Add
                            </button>
                        </form>
                    )}

                    {filtered.length === 0 && (
                        <div style={{ ...card, padding: 40, textAlign: "center", color: colors.textMuted }}>
                            No incidents here.
                        </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {filtered.map((inc) => {
                            const s = statusStyles[inc.status] || statusStyles.open;
                            const sev = severityStyles[inc.severity] || severityStyles.low;
                            return (
                                <div
                                    key={inc.id}
                                    style={{
                                        ...card,
                                        padding: "20px 24px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <Link
                                            to={`/incidents/${inc.id}`}
                                            style={{ fontSize: 17, fontWeight: 600, color: colors.text, textDecoration: "none" }}
                                        >
                                            {inc.title}
                                        </Link>
                                        <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                                            <span
                                                style={{
                                                    background: s.bg,
                                                    color: s.color,
                                                    padding: "3px 10px",
                                                    borderRadius: 5,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                {s.label}
                                            </span>
                                            <span
                                                style={{
                                                    background: sev.bg,
                                                    color: sev.color,
                                                    padding: "3px 10px",
                                                    borderRadius: 5,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                {inc.severity.toUpperCase()}
                                            </span>
                                            <span style={{ fontSize: 12, color: colors.textMuted }}>
                                                {inc.status === "closed" ? "Resolved" : "Last updated"} {timeAgo(inc.updated_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/incidents/${inc.id}`}
                                        style={{
                                            background: colors.bg,
                                            color: colors.text,
                                            padding: "10px 18px",
                                            borderRadius: 8,
                                            fontSize: 13,
                                            textDecoration: "none",
                                            border: `1px solid ${colors.border}`,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {inc.status === "closed" ? "Write postmortem" : "Update"}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: overview panel */}
                <div style={{ width: 280, flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Overview
                    </div>

                    <div style={statCard}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: colors.text }}>{openCount}</div>
                        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Open incidents</div>
                    </div>

                    <div style={statCard}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: colors.danger }}>{criticalCount}</div>
                        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Critical &amp; open</div>
                    </div>

                    <div style={statCard}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: colors.success }}>{resolvedCount}</div>
                        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Resolved</div>
                    </div>

                    <Link
                        to="/status"
                        style={{
                            display: "block",
                            textAlign: "center",
                            marginTop: 12,
                            padding: "12px",
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            color: colors.accent,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        View public status page →
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;