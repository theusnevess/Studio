import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { AgendamentosPage } from '../pages/AgendamentosPage'
import { CalendarioPage } from '../pages/CalendarioPage'
import { ClientesPage } from '../pages/ClientesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { KanbanPage } from '../pages/KanbanPage'
import { LoginPage } from '../pages/LoginPage'
import { NotificacoesPage } from '../pages/NotificacoesPage'
import { ProjetosPage } from '../pages/ProjetosPage'
import { TarefasPage } from '../pages/TarefasPage'

/**
 * Roteador principal da aplicacao.
 *
 * A rota de login fica fora do layout interno. As demais paginas compartilham
 * o AppLayout para manter consistencia visual e estrutural.
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'clientes',
        element: <ClientesPage />,
      },
      {
        path: 'projetos',
        element: <ProjetosPage />,
      },
      {
        path: 'agendamentos',
        element: <AgendamentosPage />,
      },
      {
        path: 'tarefas',
        element: <TarefasPage />,
      },
      {
        path: 'kanban',
        element: <KanbanPage />,
      },
      {
        path: 'calendario',
        element: <CalendarioPage />,
      },
      {
        path: 'notificacoes',
        element: <NotificacoesPage />,
      },
    ],
  },
])
