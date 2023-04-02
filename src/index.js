import React from "react";
import ReactDOM from "react-dom/client";

import "./main";

import App from "./App";

import "./assets/css/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);