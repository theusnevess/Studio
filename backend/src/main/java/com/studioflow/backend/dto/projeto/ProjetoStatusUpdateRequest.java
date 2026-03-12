package com.studioflow.backend.dto.projeto;

import com.studioflow.backend.entity.enums.StatusProjeto;
import jakarta.validation.constraints.NotNull;

/**
 * DTO de entrada para atualizacao simples do status do projeto.
 */
public record ProjetoStatusUpdateRequest(
    @NotNull(message = "O status do projeto e obrigatorio.")
    StatusProjeto status
) {
}
