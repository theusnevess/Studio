package com.studioflow.backend.dto.projeto;

import com.studioflow.backend.entity.enums.StatusProjeto;
import java.time.LocalDateTime;

/**
 * DTO de saida para retorno de projetos na API.
 */
public record ProjetoResponse(
    Long id,
    String nome,
    String descricao,
    StatusProjeto status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
