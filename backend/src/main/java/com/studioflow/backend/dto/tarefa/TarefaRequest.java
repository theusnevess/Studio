package com.studioflow.backend.dto.tarefa;

import com.studioflow.backend.entity.enums.PrioridadeTarefa;
import com.studioflow.backend.entity.enums.StatusTarefa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * DTO de entrada para criacao e atualizacao de tarefas.
 */
public record TarefaRequest(
    @NotBlank(message = "O titulo da tarefa e obrigatorio.")
    @Size(max = 160, message = "O titulo da tarefa deve ter no maximo 160 caracteres.")
    String titulo,

    @Size(max = 2000, message = "A descricao da tarefa deve ter no maximo 2000 caracteres.")
    String descricao,

    @NotNull(message = "O status da tarefa e obrigatorio.")
    StatusTarefa status,

    @NotNull(message = "A prioridade da tarefa e obrigatoria.")
    PrioridadeTarefa prioridade,

    LocalDateTime dataVencimento,

    @NotNull(message = "O projeto da tarefa e obrigatorio.")
    Long projetoId,

    Long responsavelId
) {
}
