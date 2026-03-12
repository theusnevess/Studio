package com.studioflow.backend.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para criacao e atualizacao de usuarios.
 */
public record UsuarioRequest(
    @NotBlank(message = "O nome do usuario e obrigatorio.")
    @Size(max = 150, message = "O nome do usuario deve ter no maximo 150 caracteres.")
    String nome,

    @NotBlank(message = "O email do usuario e obrigatorio.")
    @Email(message = "O email informado e invalido.")
    @Size(max = 150, message = "O email do usuario deve ter no maximo 150 caracteres.")
    String email,

    @NotBlank(message = "A senha do usuario e obrigatoria.")
    @Size(max = 255, message = "A senha do usuario deve ter no maximo 255 caracteres.")
    String senha
) {
}
