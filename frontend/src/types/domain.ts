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
  status: string
  prioridade: string
  projetoId: number
  projetoNome?: string
  responsavelId?: number
  responsavelNome?: string
  dataVencimento?: string
}

export type Agendamento = {
  id: number
  titulo: string
  servico: string
  status: string
  clienteId: number
  clienteNome?: string
  responsavelId?: number
  responsavelNome?: string
  projetoId?: number
  projetoNome?: string
  dataHoraInicio: string
  dataHoraFim: string
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
