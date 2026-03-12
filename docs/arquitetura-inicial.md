# Arquitetura Inicial

## Visao geral da arquitetura

O projeto adota um monorepo simples com separacao entre backend, frontend e documentacao. O backend sera responsavel pela API, regras de negocio e persistencia. O frontend sera responsavel pela interface web e pela experiencia operacional do studio.

## Responsabilidades do backend

- Expor endpoints HTTP para o sistema
- Concentrar regras de negocio e validacoes
- Persistir dados no PostgreSQL
- Preparar a base de seguranca e autenticacao
- Controlar migracoes de banco com Flyway
- Manter a modelagem central do dominio do StudioFlow

## Responsabilidades do frontend

- Apresentar as telas do sistema
- Organizar a navegacao com React Router
- Estruturar o layout operacional do StudioFlow
- Consumir a API do backend nas proximas etapas

## Decisao de uso do PostgreSQL

O PostgreSQL foi escolhido por ser um banco relacional robusto, amplamente utilizado e adequado para dados estruturados como clientes, tarefas, agendamentos e lembretes.

## Decisao de uso de JWT no futuro

Nesta etapa inicial, a autenticacao completa ainda nao sera implementada. A decisao arquitetural e preparar o backend para adotar JWT em etapas futuras, mantendo a seguranca simples agora e evitando antecipar complexidade desnecessaria.

## Decisao de modelagem inicial

O backend passa a ter uma base de dominio composta por usuarios, clientes, projetos, tarefas, agendamentos e notificacoes. Essa escolha cobre o MVP funcional e sustenta os requisitos academicos de organizacao de atividades, Kanban e calendario sem introduzir entidades fora do escopo.
