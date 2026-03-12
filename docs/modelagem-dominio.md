# Modelagem de Dominio

## Entidades principais

### Usuario

- Representa uma pessoa usuaria do sistema
- Base preparada para autenticacao futura
- Email unico no banco

### Cliente

- Representa a cliente atendida pelo studio
- Guarda contato e observacoes operacionais

### Projeto

- Representa uma frente operacional do studio
- Atende ao requisito academico de organizacao por projetos
- Pode agrupar tarefas e agendamentos

### Tarefa

- Representa uma atividade operacional do studio
- Possui status, prioridade, prazo e responsavel opcional
- Sempre pertence a um projeto
- Ja possui modulo CRUD inicial no backend
- Pode ser filtrada por `status` e `projetoId`
- Foi modelada para sustentar o quadro Kanban do StudioFlow

### Agendamento

- Representa um atendimento marcado na agenda
- Relaciona cliente, horario, servico, status e responsavel opcional
- Pode ser associado a um projeto
- Ja possui modulo CRUD inicial no backend
- Exige sempre um `Cliente` valido
- Pode ser filtrado por `status`, `clienteId`, `dataInicio` e `dataFim`
- Servira de base para calendario operacional e futuros lembretes

### Notificacao

- Representa um lembrete ou aviso interno do sistema
- Sempre pertence a um usuario
- Pode estar vinculada a um agendamento

## Relacionamentos

- `Projeto` 1:N `Tarefa`
- `Projeto` 1:N `Agendamento`
- `Usuario` 1:N `Tarefa` como responsavel opcional
- `Usuario` 1:N `Agendamento` como responsavel opcional
- `Usuario` 1:N `Notificacao`
- `Cliente` 1:N `Agendamento`
- `Agendamento` 1:N `Notificacao` de forma opcional no lado da notificacao

## Enums da modelagem

- `StatusProjeto`
- `StatusTarefa`
- `PrioridadeTarefa`
- `StatusAgendamento`
- `TipoNotificacao`

## Decisoes importantes

- Os enums sao persistidos como texto para manter clareza no banco
- A maior parte das entidades usa campos de auditoria com `createdAt` e `updatedAt`
- `Notificacao` manteve apenas `createdAt`, alinhada ao escopo atual
- O Hibernate nao cria schema automaticamente; a estrutura vem do Flyway
- A migration inicial cobre as seis tabelas centrais do MVP
- `Cliente` usa inativacao logica em vez de exclusao fisica
- `Projeto` possui atualizacao simples de status por endpoint dedicado
- `Tarefa` exige sempre um `Projeto` valido no momento de criar ou atualizar
- `Tarefa` aceita `Usuario` responsavel apenas de forma opcional
- `Tarefa` possui endpoint dedicado para troca simples de status
- `Agendamento` exige `Cliente` valido e aceita `Usuario` e `Projeto` de forma opcional
- `Agendamento` valida apenas a coerencia basica do intervalo de datas nesta etapa
- `Agendamento` possui endpoint dedicado para troca simples de status

## Dados minimos esperados para testes futuros

- Ao menos um `Usuario`
- Ao menos um `Projeto`
- Ao menos um `Cliente`

Com esses tres registros ja sera possivel evoluir os primeiros fluxos de tarefas, agendamentos e notificacoes.
