package com.studioflow.backend.service;

import com.studioflow.backend.dto.tarefa.TarefaRequest;
import com.studioflow.backend.dto.tarefa.TarefaResponse;
import com.studioflow.backend.dto.tarefa.TarefaStatusUpdateRequest;
import com.studioflow.backend.entity.Projeto;
import com.studioflow.backend.entity.Tarefa;
import com.studioflow.backend.entity.Usuario;
import com.studioflow.backend.entity.enums.StatusTarefa;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.ProjetoRepository;
import com.studioflow.backend.repository.TarefaRepository;
import com.studioflow.backend.repository.UsuarioRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsavel pelos casos de uso de tarefas.
 */
@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Cria uma nova tarefa validando projeto e responsavel quando informado.
     *
     * @param request dados recebidos pela API
     * @return tarefa criada
     */
    @Transactional
    public TarefaResponse criar(TarefaRequest request) {
        Tarefa tarefa = new Tarefa();
        applyRequest(tarefa, request);

        return toResponse(tarefaRepository.save(tarefa));
    }

    /**
     * Busca uma tarefa pelo identificador.
     *
     * @param id identificador da tarefa
     * @return tarefa encontrada
     */
    @Transactional(readOnly = true)
    public TarefaResponse buscarPorId(Long id) {
        return toResponse(findEntityById(id));
    }

    /**
     * Lista tarefas com filtros simples por status e projeto.
     *
     * @param status filtro opcional de status
     * @param projetoId filtro opcional de projeto
     * @return lista de tarefas
     */
    @Transactional(readOnly = true)
    public List<TarefaResponse> listar(StatusTarefa status, Long projetoId) {
        List<Tarefa> tarefas;

        if (status != null && projetoId != null) {
            tarefas = tarefaRepository.findAllByStatusAndProjetoIdOrderByDataVencimentoAsc(status, projetoId);
        } else if (status != null) {
            tarefas = tarefaRepository.findAllByStatusOrderByDataVencimentoAsc(status);
        } else if (projetoId != null) {
            tarefas = tarefaRepository.findAllByProjetoIdOrderByStatusAscDataVencimentoAsc(projetoId);
        } else {
            tarefas = tarefaRepository.findAllByOrderByStatusAscDataVencimentoAsc();
        }

        return tarefas.stream().map(this::toResponse).toList();
    }

    /**
     * Atualiza os dados principais de uma tarefa.
     *
     * @param id identificador da tarefa
     * @param request novos dados
     * @return tarefa atualizada
     */
    @Transactional
    public TarefaResponse atualizar(Long id, TarefaRequest request) {
        Tarefa tarefa = findEntityById(id);
        applyRequest(tarefa, request);

        return toResponse(tarefaRepository.save(tarefa));
    }

    /**
     * Atualiza apenas o status da tarefa.
     *
     * @param id identificador da tarefa
     * @param request novo status
     * @return tarefa atualizada
     */
    @Transactional
    public TarefaResponse atualizarStatus(Long id, TarefaStatusUpdateRequest request) {
        Tarefa tarefa = findEntityById(id);
        tarefa.setStatus(request.status());

        return toResponse(tarefaRepository.save(tarefa));
    }

    private Tarefa findEntityById(Long id) {
        return tarefaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tarefa nao encontrada com id " + id + "."));
    }

    private Projeto findProjetoById(Long projetoId) {
        return projetoRepository.findById(projetoId)
            .orElseThrow(() -> new ResourceNotFoundException("Projeto nao encontrado com id " + projetoId + "."));
    }

    private Usuario findUsuarioById(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado com id " + usuarioId + "."));
    }

    private void applyRequest(Tarefa tarefa, TarefaRequest request) {
        tarefa.setTitulo(request.titulo().trim());
        tarefa.setDescricao(normalize(request.descricao()));
        tarefa.setStatus(request.status());
        tarefa.setPrioridade(request.prioridade());
        tarefa.setDataVencimento(request.dataVencimento());
        tarefa.setProjeto(findProjetoById(request.projetoId()));
        tarefa.setResponsavel(
            request.responsavelId() == null ? null : findUsuarioById(request.responsavelId())
        );
    }

    private TarefaResponse toResponse(Tarefa tarefa) {
        Long responsavelId = tarefa.getResponsavel() == null ? null : tarefa.getResponsavel().getId();
        String responsavelNome = tarefa.getResponsavel() == null ? null : tarefa.getResponsavel().getNome();

        return new TarefaResponse(
            tarefa.getId(),
            tarefa.getTitulo(),
            tarefa.getDescricao(),
            tarefa.getStatus(),
            tarefa.getPrioridade(),
            tarefa.getDataVencimento(),
            tarefa.getProjeto().getId(),
            tarefa.getProjeto().getNome(),
            responsavelId,
            responsavelNome,
            tarefa.getCreatedAt(),
            tarefa.getUpdatedAt()
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
