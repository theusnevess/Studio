package com.studioflow.backend.controller;

import com.studioflow.backend.dto.projeto.ProjetoRequest;
import com.studioflow.backend.dto.projeto.ProjetoResponse;
import com.studioflow.backend.dto.projeto.ProjetoStatusUpdateRequest;
import com.studioflow.backend.entity.enums.StatusProjeto;
import com.studioflow.backend.service.ProjetoService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller REST para os endpoints de projetos.
 */
@RestController
@RequestMapping("/api/projetos")
@RequiredArgsConstructor
public class ProjetoController {

    private final ProjetoService projetoService;

    /**
     * Cria um novo projeto.
     *
     * @param request corpo validado da requisicao
     * @return projeto criado com status 201
     */
    @PostMapping
    public ResponseEntity<ProjetoResponse> criar(@Valid @RequestBody ProjetoRequest request) {
        ProjetoResponse response = projetoService.criar(request);

        return ResponseEntity
            .created(URI.create("/api/projetos/" + response.id()))
            .body(response);
    }

    /**
     * Lista projetos, opcionalmente filtrando por status.
     *
     * @param status filtro opcional
     * @return lista de projetos
     */
    @GetMapping
    public ResponseEntity<List<ProjetoResponse>> listar(
        @RequestParam(required = false) StatusProjeto status
    ) {
        return ResponseEntity.ok(projetoService.listar(status));
    }

    /**
     * Busca um projeto pelo id.
     *
     * @param id identificador do projeto
     * @return projeto encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjetoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(projetoService.buscarPorId(id));
    }

    /**
     * Atualiza nome, descricao e status de um projeto.
     *
     * @param id identificador do projeto
     * @param request novos dados validados
     * @return projeto atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjetoResponse> atualizar(
        @PathVariable Long id,
        @Valid @RequestBody ProjetoRequest request
    ) {
        return ResponseEntity.ok(projetoService.atualizar(id, request));
    }

    /**
     * Atualiza apenas o status do projeto.
     *
     * @param id identificador do projeto
     * @param request novo status validado
     * @return projeto atualizado
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ProjetoResponse> atualizarStatus(
        @PathVariable Long id,
        @Valid @RequestBody ProjetoStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(projetoService.atualizarStatus(id, request));
    }
}
