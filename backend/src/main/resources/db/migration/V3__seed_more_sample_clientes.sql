INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Larissa Mendes', '(11) 99803-4472', 'Prefere nail art delicada e atendimento no fim da tarde.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Larissa Mendes'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Mariana Ribeiro', '(11) 99784-2251', 'Costuma agendar banho de gel e manutencao no inicio do mes.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Mariana Ribeiro'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Patricia Oliveira', '(11) 99628-7135', 'Solicita confirmacao no dia anterior ao atendimento.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Patricia Oliveira'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Renata Alves', '(11) 99547-1682', 'Gosta de tons quentes e acabamento mais brilhoso.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Renata Alves'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Sabrina Rocha', '(11) 99415-8204', 'Prefere horarios apos as 18h e decoracoes minimalistas.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Sabrina Rocha'
);

INSERT INTO clientes (nome, telefone, observacoes, ativo)
SELECT 'Tatiane Moreira', '(11) 99376-5541', 'Cliente recorrente, costuma agendar junto com a filha.', TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM clientes
    WHERE nome = 'Tatiane Moreira'
);
