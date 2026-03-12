# StudioFlow

StudioFlow e um sistema web em desenvolvimento para apoiar a rotina operacional de um studio de unhas real. O projeto faz parte de uma atividade de extensao academica e foi planejado para organizar agenda, tarefas, quadro Kanban, calendario e lembretes, sem extrapolar o escopo de um MVP profissional e defensavel.

## Stack

- Backend: Java 21, Spring Boot 3, Maven, Spring Web, Spring Data JPA, Spring Security, Validation, PostgreSQL Driver, Flyway e Lombok
- Frontend: React, Vite, TypeScript, Tailwind CSS e React Router
- Banco de dados: PostgreSQL

## Estrutura

```text
.
|-- backend/
|-- docs/
`-- frontend/
```

## Como executar

### Backend

1. Crie um banco PostgreSQL chamado `studioflow` ou ajuste as variaveis de ambiente.
2. Entre em `backend/`.
3. Execute `mvn spring-boot:run` ou `./mvnw spring-boot:run`.
4. Acesse `http://localhost:8080/api/health`.

Variaveis aceitas no profile `dev`:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`

### Frontend

1. Entre em `frontend/`.
2. Execute `npm install`.
3. Execute `npm run dev`.
4. Acesse a URL informada pelo Vite, normalmente `http://localhost:5173`.

## Documentacao inicial

- `docs/visao-produto.md`
- `docs/arquitetura-inicial.md`
- `docs/padroes-de-desenvolvimento.md`
