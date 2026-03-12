package com.studioflow.backend.service;

import com.studioflow.backend.dto.projeto.ProjetoRequest;
import com.studioflow.backend.dto.projeto.ProjetoResponse;
import com.studioflow.backend.dto.projeto.ProjetoStatusUpdateRequest;
import com.studioflow.backend.entity.Projeto;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.ProjetoRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsavel pelos casos de uso de projetos.
 */
@Service
@RequiredArgsConstructor
public class ProjetoService {

    private final ProjetoRepository projetoRepository;

    /**
     * Cria um novo projeto com os dados recebidos.
     *
     * @param request dados do projeto
     * @return projeto criado
     */
    @Transactional
    public ProjetoResponse criar(ProjetoRequest request) {
        Projeto projeto = new Projeto();
        applyRequest(projeto, request);

        return toResponse(projetoRepository.save(projeto));
    }

    /**
     * Busca um projeto pelo identificador.
     *
     * @param id identificador do projeto
     * @return projeto encontrado
     */
    @Transactional(readOnly = true)
    public ProjetoResponse buscarPorId(Long id) {
        return toResponse(findEntityById(id));
    }

    /**
     * Lista projetos, com opcao de filtro simples por status.
     *
     * @param status filtro opcional
     * @return lista de projetos
     */
    @Transactional(readOnly = true)
    public List<ProjetoResponse> listar(com.studioflow.backend.entity.enums.StatusProjeto status) {
        List<Projeto> projetos = status == null
            ? projetoRepository.findAllByOrderByNomeAsc()
            : projetoRepository.findAllByStatusOrderByNomeAsc(status);

        return projetos.stream().map(this::toResponse).toList();
    }

    /**
     * Atualiza os dados editaveis de um projeto.
     *
     * @param id identificador do projeto
     * @param request novos dados
     * @return projeto atualizado
     */
    @Transactional
    public ProjetoResponse atualizar(Long id, ProjetoRequest request) {
        Projeto projeto = findEntityById(id);
        applyRequest(projeto, request);

        return toResponse(projetoRepository.save(projeto));
    }

    /**
     * Atualiza apenas o status de um projeto.
     *
     * @param id identificador do projeto
     * @param request novo status
     * @return projeto atualizado
     */
    @Transactional
    public ProjetoResponse atualizarStatus(Long id, ProjetoStatusUpdateRequest request) {
        Projeto projeto = findEntityById(id);
        projeto.setStatus(request.status());

        return toResponse(projetoRepository.save(projeto));
    }

    private Projeto findEntityById(Long id) {
        return projetoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Projeto nao encontrado com id " + id + "."));
    }

    private void applyRequest(Projeto projeto, ProjetoRequest request) {
        projeto.setNome(request.nome().trim());
        projeto.setDescricao(normalize(request.descricao()));
        projeto.setStatus(request.status());
    }

    private ProjetoResponse toResponse(Projeto projeto) {
        return new ProjetoResponse(
            projeto.getId(),
            projeto.getNome(),
            projeto.getDescricao(),
            projeto.getStatus(),
            projeto.getCreatedAt(),
            projeto.getUpdatedAt()
        );
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
