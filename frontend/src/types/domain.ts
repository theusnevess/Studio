/**
 * Tipos simplificados para o consumo inicial da API.
 *
 * Eles cobrem apenas os campos necessarios para as telas-base desta etapa.
 */
export type Cliente = {
  id: number
  nome: string
  telefone?: string
  observacoes?: string
  ativo: boolean
  createdAt?: string
  updatedAt?: string
}

export type Projeto = {
  id: number
  nome: string
  descricao?: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export type Tarefa = {
  id: number
  titulo: string
  descricao?: string
  status: StatusTarefa
  prioridade: PrioridadeTarefa
  projetoId: number
  projetoNome?: string
  responsavelId?: number
  responsavelNome?: string
  dataVencimento?: string
  createdAt?: string
  updatedAt?: string
}

export type Agendamento = {
  id: number
  titulo: string
  servico: string
  observacoes?: string
  status: StatusAgendamento
  clienteId: number
  clienteNome?: string
  responsavelId?: number
  responsavelNome?: string
  projetoId?: number
  projetoNome?: string
  dataHoraInicio: string
  dataHoraFim: string
  createdAt?: string
  updatedAt?: string
}

export type Notificacao = {
  id: number
  titulo: string
  mensagem: string
  tipo: string
  visualizada: boolean
  dataHoraEnvio: string
  usuarioId: number
}

export type Usuario = {
  id: number
  nome: string
  email: string
  ativo: boolean
}

export type ClienteRequest = {
  nome: string
  telefone?: string
  observacoes?: string
}

export type StatusProjeto =
  | 'PLANEJADO'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDO'
  | 'ARQUIVADO'

export type ProjetoRequest = {
  nome: string
  descricao?: string
  status: StatusProjeto
}

export type StatusTarefa = 'A_FAZER' | 'EM_ANDAMENTO' | 'CONCLUIDO'

export type PrioridadeTarefa = 'BAIXA' | 'MEDIA' | 'ALTA'

export type TarefaRequest = {
  titulo: string
  descricao?: string
  status: StatusTarefa
  prioridade: PrioridadeTarefa
  dataVencimento?: string
  projetoId: number
  responsavelId?: number
}

export type StatusAgendamento =
  | 'AGENDADO'
  | 'CONFIRMADO'
  | 'CONCLUIDO'
  | 'CANCELADO'

export type AgendamentoRequest = {
  titulo: string
  servico: string
  observacoes?: string
  dataHoraInicio: string
  dataHoraFim: string
  status: StatusAgendamento
  clienteId: number
  responsavelId?: number
  projetoId?: number
}
