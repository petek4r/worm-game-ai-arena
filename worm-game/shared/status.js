// worm-game/shared/status.js
document.addEventListener("DOMContentLoaded", () => {
    if (!window.ARENA_STATUS) return;

    // Apply defaults if the AI misses any fields
    const config = {
        tier: "PENDING",
        model: "Unknown Model",
        environment: "Unknown Environment",
        timeTaken: "TBD",
        date: new Date().toISOString().split('T')[0], // Defaults to today
        ...window.ARENA_STATUS
    };

    const tierData = {
        "TIER_1": { emoji: "🏆", label: "Tier 1 (Speedrun)", color: "#ffd700" },
        "TIER_2": { emoji: "🥈", label: "Tier 2 (Professional)", color: "#c0c0c0" },
        "TIER_3": { emoji: "🥉", label: "Tier 3 (Iterative Limit)", color: "#cd7f32" },
        "FAILURE": { emoji: "❌", label: "Failure", color: "#ff4444" },
        "PENDING": { emoji: "⏳", label: "Evaluating...", color: "#00ffcc" }
    };

    // If they pass a weird string, it still defaults to PENDING safely
    const currentTier = tierData[config.tier] || tierData["PENDING"];

    const badge = document.createElement("div");
    badge.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.85);
        border: 1px solid ${currentTier.color};
        color: #fff;
        font-family: monospace;
        font-size: 12px;
        padding: 8px 12px;
        border-radius: 4px;
        z-index: 9999;
        box-shadow: 0 0 10px ${currentTier.color}40;
        pointer-events: none;
        line-height: 1.4;
    `;

    badge.innerHTML = `
        <div style="font-size: 14px; margin-bottom: 4px; border-bottom: 1px solid #333; padding-bottom: 4px;">
            ${currentTier.emoji} <strong style="color: ${currentTier.color}">${currentTier.label}</strong>
        </div>
        <div><strong>Model:</strong> ${config.model}</div>
        <div><strong>Env:</strong> ${config.environment}</div>
        <div><strong>Time:</strong> ${config.timeTaken}</div>
        <div style="opacity: 0.6; margin-top: 4px; font-size: 10px;">${config.date}</div>
    `;

    document.body.appendChild(badge);
});