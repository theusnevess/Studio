INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Ana Luiza Martins', '(11) 99871-2045', 'Prefere atendimento no periodo da tarde e tons nude.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Ana Luiza Martins'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Beatriz Fernandes', '(11) 99752-1184', 'Costuma agendar manutencao a cada 20 dias.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Beatriz Fernandes'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Camila Araujo', '(11) 99134-5520', 'Gosta de alongamento em gel e decoracoes delicadas.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Camila Araujo'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Daniela Souza', '(11) 99403-7611', 'Atendimento geralmente aos sabados pela manha.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Daniela Souza'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Fernanda Lima', '(11) 99661-3329', 'Cliente recorrente; prefere esmaltes rosados.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Fernanda Lima'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Juliana Costa', '(11) 99912-8470', 'Tem sensibilidade a produtos com cheiro muito forte.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Juliana Costa'
);
