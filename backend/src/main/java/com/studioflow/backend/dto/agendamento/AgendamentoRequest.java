package com.studioflow.backend.dto.agendamento;

import com.studioflow.backend.entity.enums.StatusAgendamento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * DTO de entrada para criacao e atualizacao de agendamentos.
 */
public record AgendamentoRequest(
    @NotBlank(message = "O titulo do agendamento e obrigatorio.")
    @Size(max = 160, message = "O titulo do agendamento deve ter no maximo 160 caracteres.")
    String titulo,

    @NotBlank(message = "O servico do agendamento e obrigatorio.")
    @Size(max = 120, message = "O servico deve ter no maximo 120 caracteres.")
    String servico,

    @Size(max = 2000, message = "As observacoes devem ter no maximo 2000 caracteres.")
    String observacoes,

    @NotNull(message = "A data e hora de inicio sao obrigatorias.")
    LocalDateTime dataHoraInicio,

    @NotNull(message = "A data e hora de fim sao obrigatorias.")
    LocalDateTime dataHoraFim,

    @NotNull(message = "O status do agendamento e obrigatorio.")
    StatusAgendamento status,

    @NotNull(message = "O cliente do agendamento e obrigatorio.")
    Long clienteId,

    Long responsavelId,

    Long projetoId
) {
}
