package com.studioflow.backend.exception;

/**
 * Excecao para regras de negocio simples da aplicacao.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
