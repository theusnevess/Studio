CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_usuarios_email UNIQUE (email)
);

CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(30),
    observacoes TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projetos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarefas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(160) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) NOT NULL,
    prioridade VARCHAR(50) NOT NULL,
    data_vencimento TIMESTAMP,
    projeto_id BIGINT NOT NULL,
    responsavel_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tarefas_projeto
        FOREIGN KEY (projeto_id) REFERENCES projetos (id),
    CONSTRAINT fk_tarefas_responsavel
        FOREIGN KEY (responsavel_id) REFERENCES usuarios (id)
);

CREATE TABLE agendamentos (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(160) NOT NULL,
    servico VARCHAR(120) NOT NULL,
    observacoes TEXT,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    cliente_id BIGINT NOT NULL,
    responsavel_id BIGINT,
    projeto_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agendamentos_cliente
        FOREIGN KEY (cliente_id) REFERENCES clientes (id),
    CONSTRAINT fk_agendamentos_responsavel
        FOREIGN KEY (responsavel_id) REFERENCES usuarios (id),
    CONSTRAINT fk_agendamentos_projeto
        FOREIGN KEY (projeto_id) REFERENCES projetos (id)
);

CREATE TABLE notificacoes (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(160) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    data_hora_envio TIMESTAMP NOT NULL,
    visualizada BOOLEAN NOT NULL DEFAULT FALSE,
    agendamento_id BIGINT,
    usuario_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificacoes_agendamento
        FOREIGN KEY (agendamento_id) REFERENCES agendamentos (id),
    CONSTRAINT fk_notificacoes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

CREATE INDEX idx_tarefas_status ON tarefas (status);
CREATE INDEX idx_tarefas_projeto_id ON tarefas (projeto_id);
CREATE INDEX idx_tarefas_responsavel_id ON tarefas (responsavel_id);

CREATE INDEX idx_agendamentos_data_hora_inicio ON agendamentos (data_hora_inicio);
CREATE INDEX idx_agendamentos_cliente_id ON agendamentos (cliente_id);
CREATE INDEX idx_agendamentos_responsavel_id ON agendamentos (responsavel_id);
CREATE INDEX idx_agendamentos_projeto_id ON agendamentos (projeto_id);

CREATE INDEX idx_notificacoes_usuario_id ON notificacoes (usuario_id);
CREATE INDEX idx_notificacoes_data_hora_envio ON notificacoes (data_hora_envio);
