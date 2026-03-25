import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

/**
 * Returns the DOM node used to mount the React application.
 *
 * @returns Root HTML element.
 * @throws Error When the Vite root container is missing from the page.
 */
function getRootElement(): HTMLElement {
  const rootElement = document.getElementById('root')

  if (rootElement === null) {
    throw new Error('Root element "#root" is missing from the page.')
  }

  return rootElement
}

createRoot(getRootElement()).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
