package com.studioflow.backend.controller;

import com.studioflow.backend.dto.cliente.ClienteRequest;
import com.studioflow.backend.dto.cliente.ClienteResponse;
import com.studioflow.backend.service.ClienteService;
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
 * Controller REST para os endpoints de clientes.
 */
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    /**
     * Cria uma nova cliente.
     *
     * @param request corpo validado da requisicao
     * @return cliente criada com status 201
     */
    @PostMapping
    public ResponseEntity<ClienteResponse> criar(@Valid @RequestBody ClienteRequest request) {
        ClienteResponse response = clienteService.criar(request);

        return ResponseEntity
            .created(URI.create("/api/clientes/" + response.id()))
            .body(response);
    }

    /**
     * Lista clientes, opcionalmente filtrando por atividade.
     *
     * @param ativo filtro opcional
     * @return lista de clientes
     */
    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listar(
        @RequestParam(required = false) Boolean ativo
    ) {
        return ResponseEntity.ok(clienteService.listar(ativo));
    }

    /**
     * Busca uma cliente pelo id.
     *
     * @param id identificador da cliente
     * @return cliente encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    /**
     * Atualiza uma cliente existente.
     *
     * @param id identificador da cliente
     * @param request novos dados validados
     * @return cliente atualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> atualizar(
        @PathVariable Long id,
        @Valid @RequestBody ClienteRequest request
    ) {
        return ResponseEntity.ok(clienteService.atualizar(id, request));
    }

    /**
     * Inativa logicamente uma cliente.
     *
     * @param id identificador da cliente
     * @return cliente inativada
     */
    @PatchMapping("/{id}/inativar")
    public ResponseEntity<ClienteResponse> inativar(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.inativar(id));
    }
}
