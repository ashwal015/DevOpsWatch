export const colors = {
    bg: "#0d0e12",
    surface: "#17181d",
    surfaceHover: "#1c1e25",
    border: "#262832",
    text: "#e8e9ec",
    textMuted: "#8b8f9c",
    accent: "#4a9eff",
    success: "#2ecc71",
    warning: "#f5c518",
    danger: "#e55353",
};

export const statusStyles = {
    open: { bg: "#3b3410", color: colors.warning, label: "INVESTIGATING" },
    in_progress: { bg: "#123a2e", color: colors.success, label: "IN PROGRESS" },
    closed: { bg: "#1a2e1a", color: "#7fbf7f", label: "RESOLVED" },
};

export const severityStyles = {
    low: { bg: "#2a2a2a", color: colors.textMuted },
    medium: { bg: "#3a2a10", color: "#e5a02e" },
    critical: { bg: "#3a1414", color: colors.danger },
};

export const card = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
};