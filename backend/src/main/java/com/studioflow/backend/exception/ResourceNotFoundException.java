package com.studioflow.backend.exception;

/**
 * Excecao utilizada quando um recurso nao e encontrado.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
