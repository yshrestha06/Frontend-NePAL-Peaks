import React from "react";
import "../css/Display.css";

const bandStyles = {
  red:   { bg: "#fee2e2", fg: "#991b1b", border: "#fecaca", label: "High risk" },
  amber: { bg: "#fffbeb", fg: "#92400e", border: "#fde68a", label: "Moderate risk" },
  green: { bg: "#ecfdf5", fg: "#065f46", border: "#a7f3d0", label: "Low risk" },
};

function Stat({ label, value, unit }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".95rem" }}>
      <span style={{ color: "#6b7280" }}>{label}</span>
      <strong>{value}{unit ? ` ${unit}` : ""}</strong>
    </div>
  );
}

function MealCard({ title, data }) {
  if (!data) {
    return (
      <div className="card">
        <div className="card-label">{title}</div>
        <div className="result-empty" style={{ padding: ".75rem" }}>No image uploaded</div>
      </div>
    );
  }
  const m = data.macros || {};
  return (
    <div className="card">
      <div className="card-label">{title}</div>
      <div style={{ marginBottom: ".5rem", fontWeight: 700 }}>{data.dish ?? "Detected dish"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
        <Stat label="Portion" value={m.portion_desc || "-"} />
        <Stat label="Grams" value={m.portion_grams ?? "-"} unit="g" />
        <Stat label="Carbs" value={m.carbs_g ?? "-"} unit="g" />
        <Stat label="Protein" value={m.protein_g != null ? Number(m.protein_g).toFixed(1) : "-"} unit="g" />
        <Stat label="Fat" value={m.fat_g ?? "-"} unit="g" />
        <Stat label="Calories" value={m.kcal ?? "-"} unit="kcal" />
        <Stat label="GI (approx)" value={m.gi_approx ?? "-"} />
        <Stat label="Confidence" value={data.confidence != null ? (data.confidence * 100).toFixed(1) : "-"} unit="%" />
      </div>
    </div>
  );
}

function RiskPanel({ risk }) {
  if (!risk) {
    const style = bandStyles.amber;
    return (
      <div className="card" style={{ borderColor: style.border, background: style.bg }}>
        <div className="card-label" style={{ color: style.fg }}>Risk score</div>
        <div style={{ color: style.fg }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Not available yet</div>
          <div style={{ fontSize: ".95rem" }}>The risk endpoint hasn’t returned data.</div>
        </div>
      </div>
    );
  }
  const style = bandStyles[(risk.band || "").toLowerCase()] || bandStyles.green;
  return (
    <div className="card" style={{ borderColor: style.border, background: style.bg }}>
      <div className="card-label" style={{ color: style.fg }}>Risk score</div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ fontSize: "2rem", fontWeight: 800, color: style.fg }}>
          {risk.score ?? "-"}
        </div>
        <div>
          <div style={{ color: style.fg, fontWeight: 700 }}>{style.label}</div>
          <div style={{ color: style.fg }}>
            Probability: {risk.prob != null ? (risk.prob * 100).toFixed(1) + "%" : "-"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Display({ result }) {
  if (!result) {
    return (
      <div className="result-container">
        <h2>Results</h2>
        <div className="result-empty">No results yet.</div>
      </div>
    );
  }

  const risk  = result.risk ?? null;
  const meals = result.meals || {};
  // Accept plain /classify_food JSON (preferred), or fall back to a meal if your old shape is used
  const classification =
    result.classify || result.classification || result.meal ||
    meals.lunch || meals.breakfast || meals.dinner || null;

  return (
    <div className="result-container">
      <h2>Results</h2>

      {/* EXACTLY TWO SECTIONS */}
      <div className="columns">
        <RiskPanel risk={risk} />
        <MealCard title="Food classification" data={classification} />
      </div>

      {/* Raw (debug) */}
      <div className="card">
        <div className="card-label">Raw response</div>
        <pre className="result-json">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
}
