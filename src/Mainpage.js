import React, {useState} from "react";
import Form from "./components/Form";
import Display from "./components/Display";
import "./Mainpage.css";

function Mainpage() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleFormSubmit(formData) {
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/analyze-intake", {  
        method: "POST",
        body: formData,               
      });

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();  
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className = "mainpage">
      <div className = "main">
      <div className = "reports">
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Display result={result}/>
      </div>
      <div className = "userInput">
        <Form onSubmit={handleFormSubmit} submitting={submitting} />
      </div>
      </div>
      
    </div>
  );
}


export default Mainpage;