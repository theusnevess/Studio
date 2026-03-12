package com.studioflow.backend.controller;

import com.studioflow.backend.dto.usuario.UsuarioRequest;
import com.studioflow.backend.dto.usuario.UsuarioResponse;
import com.studioflow.backend.service.UsuarioService;
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
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller REST para os endpoints de usuarios.
 */
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    /**
     * Cria um novo usuario.
     *
     * @param request dados validados do usuario
     * @return usuario criado com status 201
     */
    @PostMapping
    public ResponseEntity<UsuarioResponse> criar(@Valid @RequestBody UsuarioRequest request) {
        UsuarioResponse response = usuarioService.criar(request);
        return ResponseEntity.created(URI.create("/api/usuarios/" + response.id())).body(response);
    }

    /**
     * Lista usuarios.
     *
     * @return lista de usuarios
     */
    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(usuarioService.listar());
    }

    /**
     * Busca um usuario pelo id.
     *
     * @param id identificador do usuario
     * @return usuario encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    /**
     * Atualiza os dados principais do usuario.
     *
     * @param id identificador do usuario
     * @param request novos dados validados
     * @return usuario atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizar(
        @PathVariable Long id,
        @Valid @RequestBody UsuarioRequest request
    ) {
        return ResponseEntity.ok(usuarioService.atualizar(id, request));
    }

    /**
     * Inativa logicamente um usuario.
     *
     * @param id identificador do usuario
     * @return usuario inativado
     */
    @PatchMapping("/{id}/inativar")
    public ResponseEntity<UsuarioResponse> inativar(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.inativar(id));
    }
}
