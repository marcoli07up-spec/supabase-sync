import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initFacebookPixel } from "./lib/facebook-pixel";

// Initialize Facebook Pixel
initFacebookPixel();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
