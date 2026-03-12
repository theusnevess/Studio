package com.studioflow.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studioflow.backend.dto.agendamento.AgendamentoRequest;
import com.studioflow.backend.dto.agendamento.AgendamentoResponse;
import com.studioflow.backend.dto.agendamento.AgendamentoStatusUpdateRequest;
import com.studioflow.backend.entity.enums.StatusAgendamento;
import com.studioflow.backend.exception.BusinessException;
import com.studioflow.backend.exception.GlobalExceptionHandler;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.service.AgendamentoService;
import java.time.LocalDateTime;
import java.util.List;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AgendamentoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AgendamentoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AgendamentoService agendamentoService;

    @Test
    void shouldCreateAgendamento() throws Exception {
        given(agendamentoService.criar(any(AgendamentoRequest.class)))
            .willReturn(agendamentoResponse(1L, StatusAgendamento.AGENDADO));

        mockMvc.perform(post("/api/agendamentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequest())))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("AGENDADO"));
    }

    @Test
    void shouldReturnNotFoundWhenClienteDoesNotExist() throws Exception {
        given(agendamentoService.criar(any(AgendamentoRequest.class)))
            .willThrow(new ResourceNotFoundException("Cliente nao encontrado com id 999."));

        AgendamentoRequest request = new AgendamentoRequest(
            "Atendimento Ana",
            "Banho de gel",
            null,
            LocalDateTime.of(2026, 3, 20, 14, 0),
            LocalDateTime.of(2026, 3, 20, 15, 0),
            StatusAgendamento.AGENDADO,
            999L,
            null,
            null
        );

        mockMvc.perform(post("/api/agendamentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Cliente nao encontrado com id 999."));
    }

    @Test
    void shouldRejectInvalidDateInterval() throws Exception {
        given(agendamentoService.criar(any(AgendamentoRequest.class)))
            .willThrow(new BusinessException("A data e hora de fim devem ser posteriores a data e hora de inicio."));

        AgendamentoRequest request = new AgendamentoRequest(
            "Atendimento Ana",
            "Banho de gel",
            null,
            LocalDateTime.of(2026, 3, 20, 15, 0),
            LocalDateTime.of(2026, 3, 20, 14, 0),
            StatusAgendamento.AGENDADO,
            1L,
            null,
            null
        );

        mockMvc.perform(post("/api/agendamentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message")
                .value("A data e hora de fim devem ser posteriores a data e hora de inicio."));
    }

    @Test
    void shouldListAgendamentosByInterval() throws Exception {
        given(agendamentoService.listar(
            eq(null),
            eq(null),
            eq(LocalDateTime.of(2026, 3, 20, 0, 0)),
            eq(LocalDateTime.of(2026, 3, 21, 0, 0))
        )).willReturn(List.of(agendamentoResponse(1L, StatusAgendamento.AGENDADO)));

        mockMvc.perform(get("/api/agendamentos")
                .param("dataInicio", "2026-03-20T00:00:00")
                .param("dataFim", "2026-03-21T00:00:00"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void shouldUpdateAgendamentoStatus() throws Exception {
        given(agendamentoService.atualizarStatus(eq(1L), any(AgendamentoStatusUpdateRequest.class)))
            .willReturn(agendamentoResponse(1L, StatusAgendamento.CONCLUIDO));

        mockMvc.perform(patch("/api/agendamentos/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new AgendamentoStatusUpdateRequest(StatusAgendamento.CONCLUIDO))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("CONCLUIDO"));
    }

    private AgendamentoRequest validRequest() {
        return new AgendamentoRequest(
            "Atendimento Ana",
            "Banho de gel",
            "Cliente preferencial",
            LocalDateTime.of(2026, 3, 20, 14, 0),
            LocalDateTime.of(2026, 3, 20, 15, 0),
            StatusAgendamento.AGENDADO,
            1L,
            null,
            null
        );
    }

    private AgendamentoResponse agendamentoResponse(Long id, StatusAgendamento status) {
        LocalDateTime now = LocalDateTime.now();
        return new AgendamentoResponse(
            id,
            "Atendimento Ana",
            "Banho de gel",
            "Cliente preferencial",
            LocalDateTime.of(2026, 3, 20, 14, 0),
            LocalDateTime.of(2026, 3, 20, 15, 0),
            status,
            1L,
            "Ana",
            null,
            null,
            null,
            null,
            now,
            now
        );
    }
}
