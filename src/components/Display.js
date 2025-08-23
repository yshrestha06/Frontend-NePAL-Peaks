import React from "react";
import "../css/Display.css";

function Display({result}) {
  if (!result) {
    return (
      <div className="result-container">
        <h2>Your Risk Assessment</h2>
        <div className="result-empty">
          No results yet. Submit your info to see analysis.
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h2>Your Risk Assessment</h2>
      <div className ="risk-assessment">
        <pre className="result-json">
        {JSON.stringify(result, null, 2)}
      </pre>
      </div>   
    </div>
  );
}

export default Display;