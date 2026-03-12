# Backend API

## Modulos concluidos

- `Usuario`
- `Cliente`
- `Projeto`
- `Tarefa`
- `Agendamento`
- `Notificacao`

## Endpoints principais

### Usuario

- `POST /api/usuarios`
- `GET /api/usuarios`
- `GET /api/usuarios/{id}`
- `PUT /api/usuarios/{id}`
- `PATCH /api/usuarios/{id}/inativar`

### Cliente

- `POST /api/clientes`
- `GET /api/clientes`
- `GET /api/clientes/{id}`
- `PUT /api/clientes/{id}`
- `PATCH /api/clientes/{id}/inativar`

### Projeto

- `POST /api/projetos`
- `GET /api/projetos`
- `GET /api/projetos/{id}`
- `PUT /api/projetos/{id}`
- `PATCH /api/projetos/{id}/status`

### Tarefa

- `POST /api/tarefas`
- `GET /api/tarefas`
- `GET /api/tarefas/{id}`
- `PUT /api/tarefas/{id}`
- `PATCH /api/tarefas/{id}/status`

Filtros:

- `status`
- `projetoId`

### Agendamento

- `POST /api/agendamentos`
- `GET /api/agendamentos`
- `GET /api/agendamentos/{id}`
- `PUT /api/agendamentos/{id}`
- `PATCH /api/agendamentos/{id}/status`

Filtros:

- `status`
- `clienteId`
- `dataInicio`
- `dataFim`

### Notificacao

- `POST /api/notificacoes`
- `GET /api/notificacoes`
- `GET /api/notificacoes/{id}`
- `PATCH /api/notificacoes/{id}/visualizar`

Filtros:

- `usuarioId`
- `visualizada`

## Padrao da API

- DTOs separados para request e response
- Validacao com Bean Validation
- Regras simples concentradas em services
- Tratamento global de erro com resposta padronizada
- `ResourceNotFoundException` para ausencias
- `BusinessException` para regras simples de negocio

## O que ainda nao foi implementado

- Login real
- JWT
- criptografia de senha
- integracao com frontend
- automacoes externas
- notificacoes em navegador ou canais externos

## Observacoes para demonstracao

- Os endpoints de dominio permanecem temporariamente liberados na configuracao de seguranca atual
- O backend ja esta pronto para demonstrar persistencia, validacoes, filtros e regras basicas do MVP
- A autenticacao real ficara para uma etapa futura, sem impedir a apresentacao tecnica da API
