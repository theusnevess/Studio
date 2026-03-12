import { RouterProvider } from 'react-router-dom'
import { router } from './router'

/**
 * Componente raiz da aplicacao frontend.
 *
 * Nesta etapa, a responsabilidade principal do App e entregar o roteador
 * configurado para que a navegacao entre paginas base funcione.
 */
function App() {
  return <RouterProvider router={router} />
}

export default App
