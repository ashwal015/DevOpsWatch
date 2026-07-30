import { useEffect, useState } from "react";
import api from "../api";

function StatusPage() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadStatus() {
        try {
            const res = await api.get("/status");
            setStatus(res.data);
        } catch (err) {
            setStatus({ status: "unknown" });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadStatus();
        const interval = setInterval(loadStatus, 10000); // refresh every 10s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: 80 }}>Loading...</div>;
    }

    const isDown = status?.status === "down";
    const isUnknown = status?.status === "unknown";

    const bannerColor = isUnknown ? "#666" : isDown ? "#c0392b" : "#27ae60";
    const bannerText = isUnknown
        ? "Unable to reach service"
        : isDown
            ? "Service Disruption"
            : "All Systems Operational";

    return (
        <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
            <h2 style={{ marginBottom: 20 }}>DevOpsWatch Status</h2>
            <div
                style={{
                    backgroundColor: bannerColor,
                    color: "white",
                    padding: "20px",
                    borderRadius: 8,
                    fontSize: 18,
                    fontWeight: "bold",
                }}
            >
                {bannerText}
            </div>
            {!isUnknown && (
                <p style={{ marginTop: 15, color: "#888" }}>
                    Open critical incidents: {status.open_critical_incidents}
                </p>
            )}
            <p style={{ marginTop: 30, fontSize: 12, color: "#888" }}>
                Auto-refreshes every 10 seconds
            </p>
        </div>
    );
}

export default StatusPage;