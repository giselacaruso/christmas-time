// global.css comes first on purpose: ES modules evaluate in import order, and
// the globe's palette.ts reads the :root design tokens the moment it loads.
// Importing App first would evaluate that palette before the stylesheet exists.
import "./global.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
