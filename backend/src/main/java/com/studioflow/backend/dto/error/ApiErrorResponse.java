package com.studioflow.backend.dto.error;

import java.time.LocalDateTime;

/**
 * Estrutura padronizada para respostas de erro da API.
 */
public record ApiErrorResponse(
    LocalDateTime timestamp,
    int status,
    String error,
    String message,
    String path
) {
}
