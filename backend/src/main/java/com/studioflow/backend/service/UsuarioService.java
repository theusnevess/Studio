package com.studioflow.backend.service;

import com.studioflow.backend.dto.usuario.UsuarioRequest;
import com.studioflow.backend.dto.usuario.UsuarioResponse;
import com.studioflow.backend.entity.Usuario;
import com.studioflow.backend.exception.BusinessException;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.UsuarioRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsavel pelos casos de uso minimos de usuarios.
 */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    /**
     * Cria um novo usuario ativo por padrao.
     *
     * @param request dados recebidos da API
     * @return usuario criado
     */
    @Transactional
    public UsuarioResponse criar(UsuarioRequest request) {
        validateEmailUnique(request.email(), null);

        Usuario usuario = new Usuario();
        usuario.setAtivo(true);
        applyRequest(usuario, request);

        return toResponse(usuarioRepository.save(usuario));
    }

    /**
     * Busca usuario pelo identificador.
     *
     * @param id identificador do usuario
     * @return usuario encontrado
     */
    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(findEntityById(id));
    }

    /**
     * Lista usuarios ordenados por nome.
     *
     * @return lista de usuarios
     */
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAllByOrderByNomeAsc().stream().map(this::toResponse).toList();
    }

    /**
     * Atualiza os dados principais do usuario.
     *
     * @param id identificador do usuario
     * @param request novos dados
     * @return usuario atualizado
     */
    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioRequest request) {
        Usuario usuario = findEntityById(id);
        validateEmailUnique(request.email(), id);
        applyRequest(usuario, request);

        return toResponse(usuarioRepository.save(usuario));
    }

    /**
     * Inativa logicamente um usuario.
     *
     * @param id identificador do usuario
     * @return usuario inativado
     */
    @Transactional
    public UsuarioResponse inativar(Long id) {
        Usuario usuario = findEntityById(id);
        usuario.setAtivo(false);

        return toResponse(usuarioRepository.save(usuario));
    }

    private Usuario findEntityById(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado com id " + id + "."));
    }

    private void validateEmailUnique(String email, Long currentId) {
        String normalizedEmail = email.trim().toLowerCase();
        boolean exists = currentId == null
            ? usuarioRepository.existsByEmail(normalizedEmail)
            : usuarioRepository.existsByEmailAndIdNot(normalizedEmail, currentId);

        if (exists) {
            throw new BusinessException("Ja existe um usuario cadastrado com o email informado.");
        }
    }

    private void applyRequest(Usuario usuario, UsuarioRequest request) {
        usuario.setNome(request.nome().trim());
        usuario.setEmail(request.email().trim().toLowerCase());
        usuario.setSenha(request.senha().trim());
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getAtivo(),
            usuario.getCreatedAt(),
            usuario.getUpdatedAt()
        );
    }
}
