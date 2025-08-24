import React, { useState } from "react";
import Form from "./components/Form";
import Display from "./components/Display";
import "./Mainpage.css";
import { ANALYZE_API, FOOD_API, PORTION_MULTIPLIER } from "./config";

async function classifyMeal(label, file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file, file.name);
  const url = `${FOOD_API}?portion_multiplier=${PORTION_MULTIPLIER}`;
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`classify_food ${label} failed: ${res.status}`);
  return await res.json();
}

export default function Mainpage() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleFormSubmit({ payload, files }) {
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
  
      const analyzeRes = await fetch(`${ANALYZE_API}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!analyzeRes.ok) throw new Error(`analyze-intake failed: ${analyzeRes.status}`);
      const analyzeData = await analyzeRes.json();

      const [bRes, lRes, dRes] = await Promise.all([
        classifyMeal("breakfast", files.breakfast),
        classifyMeal("lunch", files.lunch),
        classifyMeal("dinner", files.dinner),
      ]);


      const merged = {
        analyze: analyzeData,                 
        meals: {
          breakfast: bRes,
          lunch: lRes,
          dinner: dRes,
        },
        submitted: payload,                    
      };

      setResult(merged);
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mainpage">
      <div className="main">
        <div className="reports">
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          <Display result={result} />
        </div>
        <div className="userInput">
          <Form onSubmit={handleFormSubmit} submitting={submitting} />
        </div>
      </div>
    </div>
  );
}
