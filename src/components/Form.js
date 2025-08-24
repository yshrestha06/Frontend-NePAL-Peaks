import React, { useState, useMemo } from "react";
import "../css/Form.css";

function Form({ onSubmit, submitting }) {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");      
  const [height, setHeight] = useState(""); 
  const [weight, setWeight] = useState(""); 
  const [sugary, setSugary] = useState(""); 
  const [steps, setSteps] = useState("");
  const [sleep, setSleep] = useState("");
  const [familyHistory, setFamilyHistory] = useState(false);

  const [breakfastFile, setBreakfastFile] = useState(null);
  const [lunchFile, setLunchFile] = useState(null);
  const [dinnerFile, setDinnerFile] = useState(null);

  const canSubmit = useMemo(() => {
    return age && sex && height && weight && steps && sleep !== "" && sugary !== "";
  }, [age, sex, height, weight, steps, sleep, sugary]);

  function bmiFrom(hw, ww) {
    const h = parseFloat(hw), w = parseFloat(ww);
    if (!h || !w) return null;
    const m = h / 100;
    return +(w / (m * m)).toFixed(1);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      age: Number(age),
      sex,
      bmi: bmiFrom(height, weight),
      sugary_drinks_per_day: Number(sugary),
      steps: Number(steps),
      family_history: familyHistory ? 1 : 0,
      sleep_hours: Number(sleep),
    };

    const files = {
      breakfast: breakfastFile,
      lunch: lunchFile,
      dinner: dinnerFile,
    };

    onSubmit && onSubmit({ payload, files });
  }

  return (
    <form onSubmit={handleSubmit} className="form-container form-compact">
      <h2 className="form-title">Health Inputs</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Age</label>
          <input className="form-input" type="number" value={age} onChange={e=>setAge(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Sex</label>
          <select className="form-select" value={sex} onChange={e=>setSex(e.target.value)}>
            <option value="">Choose</option>
            <option value="M">Male (M)</option>
            <option value="F">Female (F)</option>
            <option value="O">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Height (cm)</label>
          <input className="form-input" type="number" value={height} onChange={e=>setHeight(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Weight (kg)</label>
          <input className="form-input" type="number" step="0.1" value={weight} onChange={e=>setWeight(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Sugary drinks / day</label>
          <input className="form-input" type="number" value={sugary} onChange={e=>setSugary(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Steps (per day)</label>
          <input className="form-input" type="number" step="100" value={steps} onChange={e=>setSteps(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Sleep hours</label>
          <input className="form-input" type="number" step="0.5" value={sleep} onChange={e=>setSleep(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="checkbox-item" style={{padding:".4rem .6rem"}}>
            <input type="checkbox" checked={familyHistory} onChange={e=>setFamilyHistory(e.target.checked)} />
            <span>Family history (any)</span>
          </label>
        </div>
      </div>

      <h3 className="form-subtitle">Upload Meals</h3>
      <div className="form-grid uploads-compact">
        <div className="form-group">
          <label>Breakfast</label>
          <input className="form-file" type="file" accept="image/*" onChange={e=>setBreakfastFile(e.target.files[0])}/>
        </div>
        <div className="form-group">
          <label>Lunch</label>
          <input className="form-file" type="file" accept="image/*" onChange={e=>setLunchFile(e.target.files[0])}/>
        </div>
        <div className="form-group">
          <label>Dinner</label>
          <input className="form-file" type="file" accept="image/*" onChange={e=>setDinnerFile(e.target.files[0])}/>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={!canSubmit || submitting} className="form-button">
          {submitting ? "Submitting..." : "Send"}
        </button>
      </div>
    </form>
  );
}

export default Form;
