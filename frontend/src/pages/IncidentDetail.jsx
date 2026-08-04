import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

function IncidentDetail() {
    const { id } = useParams();
    const [incident, setIncident] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [message, setMessage] = useState("");

    async function loadData() {
        const [incRes, updRes] = await Promise.all([
            api.get(`/incidents/${id}`),
            api.get(`/incidents/${id}/updates`),
        ]);
        setIncident(incRes.data);
        setUpdates(updRes.data);
    }

    useEffect(() => {
        loadData();
    }, [id]);

    async function handleAddUpdate(e) {
        e.preventDefault();
        await api.post(`/incidents/${id}/updates`, { message });
        setMessage("");
        loadData();
    }

    if (!incident) return <div style={{ textAlign: "center", marginTop: 60 }}>Loading...</div>;

    return (
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <Link to="/dashboard" style={{ color: "#888" }}>&larr; Back to dashboard</Link>

            <h2 style={{ marginTop: 10 }}>{incident.title}</h2>
            <p style={{ color: "#888" }}>
                Severity: <strong>{incident.severity}</strong> &nbsp;|&nbsp;
                Status:{" "}
                <select
                    value={incident.status}
                    onChange={async (e) => {
                        await api.patch(`/incidents/${id}`, { status: e.target.value });
                        loadData();
                    }}
                    style={{ marginLeft: 4, marginRight: 4 }}
                >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
                &nbsp;|&nbsp;
                Opened: {new Date(incident.created_at).toLocaleString()}
            </p>
            {incident.description && <p>{incident.description}</p>}

            <h3 style={{ marginTop: 30 }}>Timeline</h3>
            <form onSubmit={handleAddUpdate} style={{ marginBottom: 20 }}>
                <input
                    placeholder="Add an update (e.g. 'Investigating root cause')"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{ width: "70%", padding: 8, marginRight: 8 }}
                />
                <button type="submit">Add</button>
            </form>

            <div>
                {updates.length === 0 && <p style={{ color: "#888" }}>No updates yet.</p>}
                {updates.map((u) => (
                    <div key={u.id} style={{ borderLeft: "2px solid #444", paddingLeft: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 12, color: "#888" }}>
                            {new Date(u.created_at).toLocaleString()}
                        </div>
                        <div>{u.message}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default IncidentDetail;