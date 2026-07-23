import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
    const [incidents, setIncidents] = useState([]);
    const [title, setTitle] = useState("");
    const [severity, setSeverity] = useState("low");

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
        loadIncidents();
    }

    async function handleStatusChange(id, status) {
        await api.patch(`/incidents/${id}`, { status });
        loadIncidents();
    }

    return (
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <h2>Incidents</h2>

            <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
                <input
                    placeholder="Incident title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ marginRight: 8, padding: 6 }}
                />
                <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ marginRight: 8, padding: 6 }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="critical">Critical</option>
                </select>
                <button type="submit">Add</button>
            </form>

            <table width="100%" cellPadding="6">
                <thead>
                    <tr style={{ textAlign: "left" }}>
                        <th>Title</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {incidents.map((inc) => (
                        <tr key={inc.id}>
                            <td>{inc.title}</td>
                            <td>{inc.severity}</td>
                            <td>{inc.status}</td>
                            <td>
                                <select
                                    value={inc.status}
                                    onChange={(e) => handleStatusChange(inc.id, e.target.value)}
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;