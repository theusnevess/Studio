package com.studioflow.backend.controller;

import com.studioflow.backend.dto.tarefa.TarefaRequest;
import com.studioflow.backend.dto.tarefa.TarefaResponse;
import com.studioflow.backend.dto.tarefa.TarefaStatusUpdateRequest;
import com.studioflow.backend.entity.enums.StatusTarefa;
import com.studioflow.backend.service.TarefaService;
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
 * Controller REST para os endpoints de tarefas.
 */
@RestController
@RequestMapping("/api/tarefas")
@RequiredArgsConstructor
public class TarefaController {

    private final TarefaService tarefaService;

    /**
     * Cria uma nova tarefa.
     *
     * @param request dados validados da tarefa
     * @return tarefa criada com status 201
     */
    @PostMapping
    public ResponseEntity<TarefaResponse> criar(@Valid @RequestBody TarefaRequest request) {
        TarefaResponse response = tarefaService.criar(request);

        return ResponseEntity.created(URI.create("/api/tarefas/" + response.id())).body(response);
    }

    /**
     * Lista tarefas com filtros opcionais por status e projeto.
     *
     * @param status filtro opcional de status
     * @param projetoId filtro opcional de projeto
     * @return lista de tarefas
     */
    @GetMapping
    public ResponseEntity<List<TarefaResponse>> listar(
        @RequestParam(required = false) StatusTarefa status,
        @RequestParam(required = false) Long projetoId
    ) {
        return ResponseEntity.ok(tarefaService.listar(status, projetoId));
    }

    /**
     * Busca uma tarefa pelo id.
     *
     * @param id identificador da tarefa
     * @return tarefa encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<TarefaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tarefaService.buscarPorId(id));
    }

    /**
     * Atualiza os dados completos da tarefa.
     *
     * @param id identificador da tarefa
     * @param request novos dados validados
     * @return tarefa atualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<TarefaResponse> atualizar(
        @PathVariable Long id,
        @Valid @RequestBody TarefaRequest request
    ) {
        return ResponseEntity.ok(tarefaService.atualizar(id, request));
    }

    /**
     * Atualiza apenas o status da tarefa.
     *
     * @param id identificador da tarefa
     * @param request novo status validado
     * @return tarefa atualizada
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TarefaResponse> atualizarStatus(
        @PathVariable Long id,
        @Valid @RequestBody TarefaStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(tarefaService.atualizarStatus(id, request));
    }
}
