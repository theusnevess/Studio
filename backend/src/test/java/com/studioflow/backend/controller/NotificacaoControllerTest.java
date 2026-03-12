package com.studioflow.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studioflow.backend.dto.notificacao.NotificacaoRequest;
import com.studioflow.backend.dto.notificacao.NotificacaoResponse;
import com.studioflow.backend.entity.enums.TipoNotificacao;
import com.studioflow.backend.exception.GlobalExceptionHandler;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.service.NotificacaoService;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NotificacaoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class NotificacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private NotificacaoService notificacaoService;

    @Test
    void shouldCreateNotificacao() throws Exception {
        given(notificacaoService.criar(any(NotificacaoRequest.class))).willReturn(notificacaoResponse(1L, false));

        NotificacaoRequest request = new NotificacaoRequest(
            "Lembrete",
            "Atendimento hoje",
            TipoNotificacao.LEMBRETE_AGENDAMENTO,
            LocalDateTime.of(2026, 3, 20, 13, 0),
            1L,
            1L
        );

        mockMvc.perform(post("/api/notificacoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.visualizada").value(false));
    }

    @Test
    void shouldReturnNotFoundWhenUsuarioDoesNotExist() throws Exception {
        given(notificacaoService.criar(any(NotificacaoRequest.class)))
            .willThrow(new ResourceNotFoundException("Usuario nao encontrado com id 999."));

        NotificacaoRequest request = new NotificacaoRequest(
            "Lembrete",
            "Atendimento hoje",
            TipoNotificacao.LEMBRETE_AGENDAMENTO,
            LocalDateTime.of(2026, 3, 20, 13, 0),
            999L,
            null
        );

        mockMvc.perform(post("/api/notificacoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Usuario nao encontrado com id 999."));
    }

    @Test
    void shouldMarkNotificacaoAsVisualizada() throws Exception {
        given(notificacaoService.marcarComoVisualizada(eq(1L))).willReturn(notificacaoResponse(1L, true));

        mockMvc.perform(patch("/api/notificacoes/1/visualizar"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.visualizada").value(true));
    }

    private NotificacaoResponse notificacaoResponse(Long id, boolean visualizada) {
        return new NotificacaoResponse(
            id,
            "Lembrete",
            "Atendimento hoje",
            TipoNotificacao.LEMBRETE_AGENDAMENTO,
            LocalDateTime.of(2026, 3, 20, 13, 0),
            visualizada,
            1L,
            "Maria",
            1L,
            "Atendimento Ana",
            LocalDateTime.now()
        );
    }
}
