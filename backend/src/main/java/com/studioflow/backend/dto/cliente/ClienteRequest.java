package com.studioflow.backend.dto.cliente;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para criacao e atualizacao de clientes.
 */
public record ClienteRequest(
    @NotBlank(message = "O nome do cliente e obrigatorio.")
    @Size(max = 150, message = "O nome do cliente deve ter no maximo 150 caracteres.")
    String nome,

    @Size(max = 30, message = "O telefone deve ter no maximo 30 caracteres.")
    String telefone,

    @Size(max = 2000, message = "As observacoes devem ter no maximo 2000 caracteres.")
    String observacoes
) {
}
