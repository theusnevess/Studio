package com.studioflow.backend.dto.notificacao;

import com.studioflow.backend.entity.enums.TipoNotificacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * DTO de entrada para criacao de notificacoes.
 */
public record NotificacaoRequest(
    @NotBlank(message = "O titulo da notificacao e obrigatorio.")
    @Size(max = 160, message = "O titulo da notificacao deve ter no maximo 160 caracteres.")
    String titulo,

    @NotBlank(message = "A mensagem da notificacao e obrigatoria.")
    @Size(max = 3000, message = "A mensagem da notificacao deve ter no maximo 3000 caracteres.")
    String mensagem,

    @NotNull(message = "O tipo da notificacao e obrigatorio.")
    TipoNotificacao tipo,

    @NotNull(message = "A data e hora de envio sao obrigatorias.")
    LocalDateTime dataHoraEnvio,

    @NotNull(message = "O usuario da notificacao e obrigatorio.")
    Long usuarioId,

    Long agendamentoId
) {
}
