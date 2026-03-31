import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles.css";

/**
 * Retourne le noeud racine utilise pour monter l'application React.
 */
function getRootElement(): HTMLElement {
  const rootElement = document.getElementById("root");

  if (rootElement === null) {
    throw new Error('L\'element racine "#root" est introuvable dans la page.');
  }

  return rootElement;
}

createRoot(getRootElement()).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
