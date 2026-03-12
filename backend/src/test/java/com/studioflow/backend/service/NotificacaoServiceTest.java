package com.studioflow.backend.service;

import com.studioflow.backend.dto.notificacao.NotificacaoRequest;
import com.studioflow.backend.entity.Notificacao;
import com.studioflow.backend.entity.Usuario;
import com.studioflow.backend.entity.enums.TipoNotificacao;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.AgendamentoRepository;
import com.studioflow.backend.repository.NotificacaoRepository;
import com.studioflow.backend.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class NotificacaoServiceTest {

    @Mock
    private NotificacaoRepository notificacaoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private AgendamentoRepository agendamentoRepository;

    @InjectMocks
    private NotificacaoService notificacaoService;

    @Test
    void shouldCreateNotificacao() {
        given(usuarioRepository.findById(1L)).willReturn(Optional.of(usuario(1L)));
        given(notificacaoRepository.save(any(Notificacao.class))).willAnswer(invocation -> {
            Notificacao notificacao = invocation.getArgument(0);
            notificacao.setId(1L);
            return notificacao;
        });

        var response = notificacaoService.criar(validRequest(1L));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.visualizada()).isFalse();
    }

    @Test
    void shouldRejectMissingUsuario() {
        given(usuarioRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> notificacaoService.criar(validRequest(99L)))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Usuario nao encontrado com id 99.");
    }

    @Test
    void shouldMarkAsVisualizada() {
        Notificacao notificacao = new Notificacao();
        notificacao.setId(1L);
        notificacao.setUsuario(usuario(1L));
        notificacao.setVisualizada(false);

        given(notificacaoRepository.findById(1L)).willReturn(Optional.of(notificacao));
        given(notificacaoRepository.save(any(Notificacao.class))).willAnswer(invocation -> invocation.getArgument(0));

        var response = notificacaoService.marcarComoVisualizada(1L);

        assertThat(response.visualizada()).isTrue();
    }

    private NotificacaoRequest validRequest(Long usuarioId) {
        return new NotificacaoRequest(
            "Lembrete",
            "Atendimento hoje",
            TipoNotificacao.LEMBRETE_AGENDAMENTO,
            LocalDateTime.of(2026, 3, 20, 13, 0),
            usuarioId,
            null
        );
    }

    private Usuario usuario(Long id) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNome("Maria");
        return usuario;
    }
}
