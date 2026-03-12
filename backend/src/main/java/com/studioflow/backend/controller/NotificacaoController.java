package com.studioflow.backend.controller;

import com.studioflow.backend.dto.notificacao.NotificacaoRequest;
import com.studioflow.backend.dto.notificacao.NotificacaoResponse;
import com.studioflow.backend.service.NotificacaoService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller REST para os endpoints de notificacoes.
 */
@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    /**
     * Cria uma nova notificacao.
     *
     * @param request dados validados da notificacao
     * @return notificacao criada com status 201
     */
    @PostMapping
    public ResponseEntity<NotificacaoResponse> criar(@Valid @RequestBody NotificacaoRequest request) {
        NotificacaoResponse response = notificacaoService.criar(request);
        return ResponseEntity.created(URI.create("/api/notificacoes/" + response.id())).body(response);
    }

    /**
     * Lista notificacoes com filtros opcionais por usuario e visualizacao.
     *
     * @param usuarioId filtro opcional de usuario
     * @param visualizada filtro opcional de visualizacao
     * @return lista de notificacoes
     */
    @GetMapping
    public ResponseEntity<List<NotificacaoResponse>> listar(
        @RequestParam(required = false) Long usuarioId,
        @RequestParam(required = false) Boolean visualizada
    ) {
        return ResponseEntity.ok(notificacaoService.listar(usuarioId, visualizada));
    }

    /**
     * Busca uma notificacao pelo id.
     *
     * @param id identificador da notificacao
     * @return notificacao encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<NotificacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(notificacaoService.buscarPorId(id));
    }

    /**
     * Marca uma notificacao como visualizada.
     *
     * @param id identificador da notificacao
     * @return notificacao atualizada
     */
    @PatchMapping("/{id}/visualizar")
    public ResponseEntity<NotificacaoResponse> visualizar(@PathVariable Long id) {
        return ResponseEntity.ok(notificacaoService.marcarComoVisualizada(id));
    }
}
