package com.studioflow.backend.service;

import com.studioflow.backend.dto.notificacao.NotificacaoRequest;
import com.studioflow.backend.dto.notificacao.NotificacaoResponse;
import com.studioflow.backend.entity.Agendamento;
import com.studioflow.backend.entity.Notificacao;
import com.studioflow.backend.entity.Usuario;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.AgendamentoRepository;
import com.studioflow.backend.repository.NotificacaoRepository;
import com.studioflow.backend.repository.UsuarioRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsavel pelos casos de uso de notificacoes.
 */
@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AgendamentoRepository agendamentoRepository;

    /**
     * Cria uma nova notificacao.
     *
     * @param request dados recebidos da API
     * @return notificacao criada
     */
    @Transactional
    public NotificacaoResponse criar(NotificacaoRequest request) {
        Notificacao notificacao = new Notificacao();
        notificacao.setVisualizada(false);
        applyRequest(notificacao, request);

        return toResponse(notificacaoRepository.save(notificacao));
    }

    /**
     * Busca notificacao pelo identificador.
     *
     * @param id identificador da notificacao
     * @return notificacao encontrada
     */
    @Transactional(readOnly = true)
    public NotificacaoResponse buscarPorId(Long id) {
        return toResponse(findEntityById(id));
    }

    /**
     * Lista notificacoes com filtros simples por usuario e visualizacao.
     *
     * @param usuarioId filtro opcional de usuario
     * @param visualizada filtro opcional de visualizacao
     * @return lista de notificacoes
     */
    @Transactional(readOnly = true)
    public List<NotificacaoResponse> listar(Long usuarioId, Boolean visualizada) {
        List<Notificacao> notificacoes;

        if (usuarioId != null && visualizada != null) {
            notificacoes = notificacaoRepository.findAllByUsuarioIdAndVisualizadaOrderByDataHoraEnvioDesc(
                usuarioId,
                visualizada
            );
        } else if (usuarioId != null) {
            notificacoes = notificacaoRepository.findAllByUsuarioIdOrderByDataHoraEnvioDesc(usuarioId);
        } else if (visualizada != null) {
            notificacoes = notificacaoRepository.findAllByVisualizadaOrderByDataHoraEnvioDesc(visualizada);
        } else {
            notificacoes = notificacaoRepository.findAllByOrderByDataHoraEnvioDesc();
        }

        return notificacoes.stream().map(this::toResponse).toList();
    }

    /**
     * Marca uma notificacao como visualizada.
     *
     * @param id identificador da notificacao
     * @return notificacao atualizada
     */
    @Transactional
    public NotificacaoResponse marcarComoVisualizada(Long id) {
        Notificacao notificacao = findEntityById(id);
        notificacao.setVisualizada(true);

        return toResponse(notificacaoRepository.save(notificacao));
    }

    private Notificacao findEntityById(Long id) {
        return notificacaoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notificacao nao encontrada com id " + id + "."));
    }

    private Usuario findUsuarioById(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado com id " + usuarioId + "."));
    }

    private Agendamento findAgendamentoById(Long agendamentoId) {
        return agendamentoRepository.findById(agendamentoId)
            .orElseThrow(() -> new ResourceNotFoundException("Agendamento nao encontrado com id " + agendamentoId + "."));
    }

    private void applyRequest(Notificacao notificacao, NotificacaoRequest request) {
        notificacao.setTitulo(request.titulo().trim());
        notificacao.setMensagem(request.mensagem().trim());
        notificacao.setTipo(request.tipo());
        notificacao.setDataHoraEnvio(request.dataHoraEnvio());
        notificacao.setUsuario(findUsuarioById(request.usuarioId()));
        notificacao.setAgendamento(
            request.agendamentoId() == null ? null : findAgendamentoById(request.agendamentoId())
        );
    }

    private NotificacaoResponse toResponse(Notificacao notificacao) {
        Long agendamentoId = notificacao.getAgendamento() == null ? null : notificacao.getAgendamento().getId();
        String agendamentoTitulo = notificacao.getAgendamento() == null
            ? null
            : notificacao.getAgendamento().getTitulo();

        return new NotificacaoResponse(
            notificacao.getId(),
            notificacao.getTitulo(),
            notificacao.getMensagem(),
            notificacao.getTipo(),
            notificacao.getDataHoraEnvio(),
            notificacao.getVisualizada(),
            notificacao.getUsuario().getId(),
            notificacao.getUsuario().getNome(),
            agendamentoId,
            agendamentoTitulo,
            notificacao.getCreatedAt()
        );
    }
}
