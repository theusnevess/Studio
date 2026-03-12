package com.studioflow.backend.dto.tarefa;

import com.studioflow.backend.entity.enums.StatusTarefa;
import jakarta.validation.constraints.NotNull;

/**
 * DTO de entrada para atualizacao simples do status da tarefa.
 */
public record TarefaStatusUpdateRequest(
    @NotNull(message = "O status da tarefa e obrigatorio.")
    StatusTarefa status
) {
}
