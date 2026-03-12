package com.studioflow.backend.dto.agendamento;

import com.studioflow.backend.entity.enums.StatusAgendamento;
import jakarta.validation.constraints.NotNull;

/**
 * DTO de entrada para atualizacao simples do status do agendamento.
 */
public record AgendamentoStatusUpdateRequest(
    @NotNull(message = "O status do agendamento e obrigatorio.")
    StatusAgendamento status
) {
}
