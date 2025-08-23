import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Mainpage from './Mainpage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Mainpage />
  </React.StrictMode>
);


reportWebVitals();
