package com.studioflow.backend.dto.agendamento;

import com.studioflow.backend.entity.enums.StatusAgendamento;
import java.time.LocalDateTime;

/**
 * DTO de saida para uso futuro em agenda e calendario.
 */
public record AgendamentoResponse(
    Long id,
    String titulo,
    String servico,
    String observacoes,
    LocalDateTime dataHoraInicio,
    LocalDateTime dataHoraFim,
    StatusAgendamento status,
    Long clienteId,
    String clienteNome,
    Long responsavelId,
    String responsavelNome,
    Long projetoId,
    String projetoNome,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
}
