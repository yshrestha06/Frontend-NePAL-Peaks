import React, { useState, useMemo } from "react";
import "../css/Form.css";

function Form({ onSubmit, submitting }) {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  const [steps, setSteps] = useState("");                 // e.g. "1000-1999"
  const [familyHistory, setFamilyHistory] = useState([]); // array of strings
  const [fhOpen, setFhOpen] = useState(false);            // dropdown open/close

  const [breakfastFile, setBreakfastFile] = useState(null);
  const [lunchFile, setLunchFile] = useState(null);
  const [dinnerFile, setDinnerFile] = useState(null);

  const canSubmit = useMemo(() => {
    return (
      name &&
      height &&
      weight &&
      age &&
      steps &&
      (breakfastFile || lunchFile || dinnerFile)
    );
  }, [name, height, weight, age, steps, breakfastFile, lunchFile, dinnerFile]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("height", height);
    formData.append("weight", weight);
    formData.append("age", age);
    formData.append("steps", steps);
    formData.append("familyHistory", JSON.stringify(familyHistory)); 

    if (breakfastFile) formData.append("breakfast", breakfastFile);
    if (lunchFile) formData.append("lunch", lunchFile);
    if (dinnerFile) formData.append("dinner", dinnerFile);

    if (onSubmit) onSubmit(formData);


  }

  const FAMILY_OPTIONS = [
    "Diabetes",
    "Hypertension",
    "Heart disease",
    "High cholesterol",
    "Obesity",
    "Stroke",
    "Cancer",
    "Thyroid disorder",
    "Asthma",
  ];

  const toggleHistory = (cond, checked) => {
    if (checked) {
      setFamilyHistory(prev => (prev.includes(cond) ? prev : [...prev, cond]));
    } else {
      setFamilyHistory(prev => prev.filter(x => x !== cond));
    }
  };

  const fhLabel =
    familyHistory.length === 0
      ? "Select family history"
      : familyHistory.length === 1
      ? familyHistory[0]
      : `${familyHistory[0]} +${familyHistory.length - 1}`;

  return (
    <form onSubmit={handleSubmit} className="form-container form-compact">
      <h2 className="form-title">Your Info & Meals</h2>

      {/* compact 2-col grid */}
      <div className="form-grid">
        <div className="form-group">
          <label>Name</label>
          <input
            className="form-input"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            className="form-input"
            type="number"
            placeholder="Age"
            value={age}
            onChange={e => setAge(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Height (cm)</label>
          <input
            className="form-input"
            placeholder="Height"
            value={height}
            onChange={e => setHeight(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Weight (kg)</label>
          <input
            className="form-input"
            placeholder="Weight"
            value={weight}
            onChange={e => setWeight(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Daily Steps</label>
          <select
            className="form-select"
            value={steps}
            onChange={e => setSteps(e.target.value)}
          >
            <option value="">Select your steps</option>
            <option value="0-999">0–999</option>
            <option value="1000-1999">1,000–1,999</option>
            <option value="2000-3999">2,000–3,999</option>
            <option value="4000-5999">4,000–5,999</option>
            <option value="6000-7999">6,000–7,999</option>
            <option value="8000-9999">8,000–9,999</option>
            <option value="10000-11999">10,000–11,999</option>
            <option value="12000+">12,000+</option>
          </select>
        </div>

        {/* Family History compact dropdown */}
        <div className="form-group">
          <label>Family History</label>
          <div className="fh-dropdown">
            <button
              type="button"
              className="fh-button"
              onClick={() => setFhOpen(o => !o)}
              aria-expanded={fhOpen}
              aria-haspopup="listbox"
            >
              {fhLabel}
              <span className={`fh-caret ${fhOpen ? "open" : ""}`}>▾</span>
            </button>

            {fhOpen && (
              <div className="fh-panel" role="listbox">
                {FAMILY_OPTIONS.map(cond => {
                  const checked = familyHistory.includes(cond);
                  return (
                    <label key={cond} className="fh-option">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => toggleHistory(cond, e.target.checked)}
                      />
                      <span>{cond}</span>
                    </label>
                  );
                })}

                <div className="fh-actions">
                  <button
                    type="button"
                    className="fh-action"
                    onClick={() => setFamilyHistory([])}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="fh-action primary"
                    onClick={() => setFhOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="form-subtitle">Upload Meals</h3>
      <div className="form-grid uploads-compact">
        <div className="form-group">
          <label>Breakfast</label>
          <input
            className="form-file"
            type="file"
            accept="image/*"
            onChange={e => setBreakfastFile(e.target.files[0])}
          />
        </div>
        <div className="form-group">
          <label>Lunch</label>
          <input
            className="form-file"
            type="file"
            accept="image/*"
            onChange={e => setLunchFile(e.target.files[0])}
          />
        </div>
        <div className="form-group">
          <label>Dinner</label>
          <input
            className="form-file"
            type="file"
            accept="image/*"
            onChange={e => setDinnerFile(e.target.files[0])}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="form-button"
        >
          {submitting ? "Submitting..." : "Send to backend"}
        </button>
      </div>
    </form>
  );
}

export default Form;
