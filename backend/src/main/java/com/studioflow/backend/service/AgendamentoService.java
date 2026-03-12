package com.studioflow.backend.service;

import com.studioflow.backend.dto.agendamento.AgendamentoRequest;
import com.studioflow.backend.dto.agendamento.AgendamentoResponse;
import com.studioflow.backend.dto.agendamento.AgendamentoStatusUpdateRequest;
import com.studioflow.backend.entity.Agendamento;
import com.studioflow.backend.entity.Cliente;
import com.studioflow.backend.entity.Projeto;
import com.studioflow.backend.entity.Usuario;
import com.studioflow.backend.entity.enums.StatusAgendamento;
import com.studioflow.backend.exception.BusinessException;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.AgendamentoRepository;
import com.studioflow.backend.repository.ClienteRepository;
import com.studioflow.backend.repository.ProjetoRepository;
import com.studioflow.backend.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsavel pelos casos de uso de agendamentos.
 */
@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProjetoRepository projetoRepository;

    /**
     * Cria um novo agendamento.
     *
     * @param request dados recebidos da API
     * @return agendamento criado
     */
    @Transactional
    public AgendamentoResponse criar(AgendamentoRequest request) {
        Agendamento agendamento = new Agendamento();
        applyRequest(agendamento, request);

        return toResponse(agendamentoRepository.save(agendamento));
    }

    /**
     * Busca um agendamento pelo identificador.
     *
     * @param id identificador do agendamento
     * @return agendamento encontrado
     */
    @Transactional(readOnly = true)
    public AgendamentoResponse buscarPorId(Long id) {
        return toResponse(findEntityById(id));
    }

    /**
     * Lista agendamentos com filtros simples de status, cliente e intervalo.
     *
     * @param status filtro opcional de status
     * @param clienteId filtro opcional de cliente
     * @param dataInicio inicio opcional do intervalo
     * @param dataFim fim opcional do intervalo
     * @return lista de agendamentos
     */
    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listar(
        StatusAgendamento status,
        Long clienteId,
        LocalDateTime dataInicio,
        LocalDateTime dataFim
    ) {
        validateDateRange(dataInicio, dataFim);

        List<Agendamento> agendamentos;

        if (dataInicio != null && dataFim != null) {
            agendamentos = agendamentoRepository.findAllByDataHoraInicioBetweenOrderByDataHoraInicioAsc(
                dataInicio,
                dataFim
            );
        } else if (status != null && clienteId != null) {
            agendamentos = agendamentoRepository.findAllByStatusAndClienteIdOrderByDataHoraInicioAsc(
                status,
                clienteId
            );
        } else if (status != null) {
            agendamentos = agendamentoRepository.findAllByStatusOrderByDataHoraInicioAsc(status);
        } else if (clienteId != null) {
            agendamentos = agendamentoRepository.findAllByClienteIdOrderByDataHoraInicioAsc(clienteId);
        } else {
            agendamentos = agendamentoRepository.findAllByOrderByDataHoraInicioAsc();
        }

        return agendamentos.stream().map(this::toResponse).toList();
    }

    /**
     * Atualiza os dados principais do agendamento.
     *
     * @param id identificador do agendamento
     * @param request novos dados
     * @return agendamento atualizado
     */
    @Transactional
    public AgendamentoResponse atualizar(Long id, AgendamentoRequest request) {
        Agendamento agendamento = findEntityById(id);
        applyRequest(agendamento, request);

        return toResponse(agendamentoRepository.save(agendamento));
    }

    /**
     * Atualiza apenas o status do agendamento.
     *
     * @param id identificador do agendamento
     * @param request novo status
     * @return agendamento atualizado
     */
    @Transactional
    public AgendamentoResponse atualizarStatus(Long id, AgendamentoStatusUpdateRequest request) {
        Agendamento agendamento = findEntityById(id);
        agendamento.setStatus(request.status());

        return toResponse(agendamentoRepository.save(agendamento));
    }

    private Agendamento findEntityById(Long id) {
        return agendamentoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Agendamento nao encontrado com id " + id + "."));
    }

    private Cliente findClienteById(Long clienteId) {
        return clienteRepository.findById(clienteId)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado com id " + clienteId + "."));
    }

    private Usuario findUsuarioById(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado com id " + usuarioId + "."));
    }

    private Projeto findProjetoById(Long projetoId) {
        return projetoRepository.findById(projetoId)
            .orElseThrow(() -> new ResourceNotFoundException("Projeto nao encontrado com id " + projetoId + "."));
    }

    private void applyRequest(Agendamento agendamento, AgendamentoRequest request) {
        validateStartEnd(request.dataHoraInicio(), request.dataHoraFim());

        agendamento.setTitulo(request.titulo().trim());
        agendamento.setServico(request.servico().trim());
        agendamento.setObservacoes(normalize(request.observacoes()));
        agendamento.setDataHoraInicio(request.dataHoraInicio());
        agendamento.setDataHoraFim(request.dataHoraFim());
        agendamento.setStatus(request.status());
        agendamento.setCliente(findClienteById(request.clienteId()));
        agendamento.setResponsavel(
            request.responsavelId() == null ? null : findUsuarioById(request.responsavelId())
        );
        agendamento.setProjeto(
            request.projetoId() == null ? null : findProjetoById(request.projetoId())
        );
    }

    private AgendamentoResponse toResponse(Agendamento agendamento) {
        Long responsavelId = agendamento.getResponsavel() == null ? null : agendamento.getResponsavel().getId();
        String responsavelNome = agendamento.getResponsavel() == null ? null : agendamento.getResponsavel().getNome();
        Long projetoId = agendamento.getProjeto() == null ? null : agendamento.getProjeto().getId();
        String projetoNome = agendamento.getProjeto() == null ? null : agendamento.getProjeto().getNome();

        return new AgendamentoResponse(
            agendamento.getId(),
            agendamento.getTitulo(),
            agendamento.getServico(),
            agendamento.getObservacoes(),
            agendamento.getDataHoraInicio(),
            agendamento.getDataHoraFim(),
            agendamento.getStatus(),
            agendamento.getCliente().getId(),
            agendamento.getCliente().getNome(),
            responsavelId,
            responsavelNome,
            projetoId,
            projetoNome,
            agendamento.getCreatedAt(),
            agendamento.getUpdatedAt()
        );
    }

    private void validateStartEnd(LocalDateTime dataHoraInicio, LocalDateTime dataHoraFim) {
        if (!dataHoraFim.isAfter(dataHoraInicio)) {
            throw new BusinessException("A data e hora de fim devem ser posteriores a data e hora de inicio.");
        }
    }

    private void validateDateRange(LocalDateTime dataInicio, LocalDateTime dataFim) {
        if ((dataInicio == null && dataFim != null) || (dataInicio != null && dataFim == null)) {
            throw new BusinessException("Os filtros dataInicio e dataFim devem ser informados juntos.");
        }

        if (dataInicio != null && !dataFim.isAfter(dataInicio) && !dataFim.isEqual(dataInicio)) {
            throw new BusinessException("O intervalo informado para listagem de agendamentos e invalido.");
        }
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
