package com.studioflow.backend.controller;

import com.studioflow.backend.dto.agendamento.AgendamentoRequest;
import com.studioflow.backend.dto.agendamento.AgendamentoResponse;
import com.studioflow.backend.dto.agendamento.AgendamentoStatusUpdateRequest;
import com.studioflow.backend.entity.enums.StatusAgendamento;
import com.studioflow.backend.service.AgendamentoService;
import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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
 * Controller REST para os endpoints de agendamentos.
 */
@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    /**
     * Cria um novo agendamento.
     *
     * @param request dados validados do agendamento
     * @return agendamento criado com status 201
     */
    @PostMapping
    public ResponseEntity<AgendamentoResponse> criar(@Valid @RequestBody AgendamentoRequest request) {
        AgendamentoResponse response = agendamentoService.criar(request);

        return ResponseEntity.created(URI.create("/api/agendamentos/" + response.id())).body(response);
    }

    /**
     * Lista agendamentos com filtros opcionais.
     *
     * @param status filtro opcional de status
     * @param clienteId filtro opcional de cliente
     * @param dataInicio filtro opcional de inicio
     * @param dataFim filtro opcional de fim
     * @return lista de agendamentos
     */
    @GetMapping
    public ResponseEntity<List<AgendamentoResponse>> listar(
        @RequestParam(required = false) StatusAgendamento status,
        @RequestParam(required = false) Long clienteId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim
    ) {
        return ResponseEntity.ok(agendamentoService.listar(status, clienteId, dataInicio, dataFim));
    }

    /**
     * Busca um agendamento pelo id.
     *
     * @param id identificador do agendamento
     * @return agendamento encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.buscarPorId(id));
    }

    /**
     * Atualiza os dados principais do agendamento.
     *
     * @param id identificador do agendamento
     * @param request novos dados validados
     * @return agendamento atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> atualizar(
        @PathVariable Long id,
        @Valid @RequestBody AgendamentoRequest request
    ) {
        return ResponseEntity.ok(agendamentoService.atualizar(id, request));
    }

    /**
     * Atualiza apenas o status do agendamento.
     *
     * @param id identificador do agendamento
     * @param request novo status validado
     * @return agendamento atualizado
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<AgendamentoResponse> atualizarStatus(
        @PathVariable Long id,
        @Valid @RequestBody AgendamentoStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(agendamentoService.atualizarStatus(id, request));
    }
}
