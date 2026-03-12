import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// O ponto de entrada do frontend monta a aplicacao React na div "root"
// definida em index.html. O StrictMode ajuda a detectar problemas comuns
// durante o desenvolvimento.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
