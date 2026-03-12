package com.studioflow.backend.dto.usuario;

import java.time.LocalDateTime;

/**
 * DTO de saida para retorno de usuarios na API.
 */
public record UsuarioResponse(
    Long id,
    String nome,
    String email,
    Boolean ativo,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
