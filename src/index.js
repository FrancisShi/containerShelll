import React from "react";
import ReactDOM from "react-dom/client";

import WebApp from "./WebApp.js";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WebApp />
  </React.StrictMode>
);
