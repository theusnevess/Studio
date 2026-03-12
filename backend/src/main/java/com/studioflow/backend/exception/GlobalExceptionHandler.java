package com.studioflow.backend.exception;

import com.studioflow.backend.dto.error.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Handler global para padronizar erros retornados pela API.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Trata erros de regra de negocio simples.
     *
     * @param ex excecao disparada pela aplicacao
     * @param request requisicao HTTP atual
     * @return resposta padronizada de erro 400
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessException(
        BusinessException ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
    }

    /**
     * Trata cenarios em que o recurso solicitado nao existe.
     *
     * @param ex excecao disparada pela aplicacao
     * @param request requisicao HTTP atual
     * @return resposta padronizada de erro 404
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
    }

    /**
     * Trata erros de validacao nos DTOs de entrada.
     *
     * @param ex excecao com os detalhes da validacao
     * @param request requisicao HTTP atual
     * @return resposta padronizada de erro 400
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
        MethodArgumentNotValidException ex,
        HttpServletRequest request
    ) {
        String message = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(this::formatFieldError)
            .collect(Collectors.joining("; "));

        return buildResponse(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    /**
     * Trata erros de conversao de tipos em parametros da requisicao.
     *
     * @param ex excecao com o erro de conversao
     * @param request requisicao HTTP atual
     * @return resposta padronizada de erro 400
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(
        MethodArgumentTypeMismatchException ex,
        HttpServletRequest request
    ) {
        String message = "Parametro invalido: " + ex.getName() + ".";
        return buildResponse(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    /**
     * Trata erros de leitura do corpo JSON, como enums invalidos.
     *
     * @param ex excecao disparada pelo parser
     * @param request requisicao HTTP atual
     * @return resposta padronizada de erro 400
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleNotReadable(
        HttpMessageNotReadableException ex,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.BAD_REQUEST,
            "Corpo da requisicao invalido ou mal formatado.",
            request.getRequestURI()
        );
    }

    /**
     * Trata falhas inesperadas mantendo uma estrutura consistente na resposta.
     *
     * @param ex excecao nao tratada anteriormente
     * @param request requisicao HTTP atual
     * @return resposta padronizada de erro 500
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
        Exception ex,
        HttpServletRequest request
    ) {
        return buildResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Ocorreu um erro interno inesperado.",
            request.getRequestURI()
        );
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
        HttpStatus status,
        String message,
        String path
    ) {
        ApiErrorResponse response = new ApiErrorResponse(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            path
        );

        return ResponseEntity.status(status).body(response);
    }

    private String formatFieldError(FieldError fieldError) {
        return fieldError.getField() + ": " + fieldError.getDefaultMessage();
    }
}
