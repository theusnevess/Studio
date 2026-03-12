package com.studioflow.backend.dto.notificacao;

import com.studioflow.backend.entity.enums.TipoNotificacao;
import java.time.LocalDateTime;

/**
 * DTO de saida de notificacoes.
 */
public record NotificacaoResponse(
    Long id,
    String titulo,
    String mensagem,
    TipoNotificacao tipo,
    LocalDateTime dataHoraEnvio,
    Boolean visualizada,
    Long usuarioId,
    String usuarioNome,
    Long agendamentoId,
    String agendamentoTitulo,
    LocalDateTime createdAt
) {
}
