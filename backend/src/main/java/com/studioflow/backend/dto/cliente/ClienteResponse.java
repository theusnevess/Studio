package com.studioflow.backend.dto.cliente;

import java.time.LocalDateTime;

/**
 * DTO de saida para retorno de clientes na API.
 */
public record ClienteResponse(
    Long id,
    String nome,
    String telefone,
    String observacoes,
    Boolean ativo,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
