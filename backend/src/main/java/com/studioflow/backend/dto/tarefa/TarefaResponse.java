package com.studioflow.backend.dto.tarefa;

import com.studioflow.backend.entity.enums.PrioridadeTarefa;
import com.studioflow.backend.entity.enums.StatusTarefa;
import java.time.LocalDateTime;

/**
 * DTO de saida com dados suficientes para uso futuro no frontend e no Kanban.
 */
public record TarefaResponse(
    Long id,
    String titulo,
    String descricao,
    StatusTarefa status,
    PrioridadeTarefa prioridade,
    LocalDateTime dataVencimento,
    Long projetoId,
    String projetoNome,
    Long responsavelId,
    String responsavelNome,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
