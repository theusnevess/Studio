package com.studioflow.backend.dto.projeto;

import com.studioflow.backend.entity.enums.StatusProjeto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para criacao e atualizacao de projetos.
 */
public record ProjetoRequest(
    @NotBlank(message = "O nome do projeto e obrigatorio.")
    @Size(max = 150, message = "O nome do projeto deve ter no maximo 150 caracteres.")
    String nome,

    @Size(max = 2000, message = "A descricao deve ter no maximo 2000 caracteres.")
    String descricao,

    @NotNull(message = "O status do projeto e obrigatorio.")
    StatusProjeto status
) {
}
