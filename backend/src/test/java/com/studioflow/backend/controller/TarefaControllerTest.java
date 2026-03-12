package com.studioflow.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studioflow.backend.dto.tarefa.TarefaRequest;
import com.studioflow.backend.dto.tarefa.TarefaResponse;
import com.studioflow.backend.dto.tarefa.TarefaStatusUpdateRequest;
import com.studioflow.backend.entity.enums.PrioridadeTarefa;
import com.studioflow.backend.entity.enums.StatusTarefa;
import com.studioflow.backend.exception.GlobalExceptionHandler;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.service.TarefaService;
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

@WebMvcTest(TarefaController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class TarefaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TarefaService tarefaService;

    @Test
    void shouldCreateTarefa() throws Exception {
        given(tarefaService.criar(any(TarefaRequest.class))).willReturn(tarefaResponse(1L, StatusTarefa.A_FAZER));

        TarefaRequest request = new TarefaRequest(
            "Separar materiais",
            "Lista inicial",
            StatusTarefa.A_FAZER,
            PrioridadeTarefa.MEDIA,
            LocalDateTime.of(2026, 3, 20, 10, 0),
            1L,
            null
        );

        mockMvc.perform(post("/api/tarefas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.titulo").value("Separar materiais"));
    }

    @Test
    void shouldReturnNotFoundWhenProjetoDoesNotExist() throws Exception {
        given(tarefaService.criar(any(TarefaRequest.class)))
            .willThrow(new ResourceNotFoundException("Projeto nao encontrado com id 999."));

        TarefaRequest request = new TarefaRequest(
            "Separar materiais",
            null,
            StatusTarefa.A_FAZER,
            PrioridadeTarefa.MEDIA,
            null,
            999L,
            null
        );

        mockMvc.perform(post("/api/tarefas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Projeto nao encontrado com id 999."));
    }

    @Test
    void shouldListTarefasByStatus() throws Exception {
        given(tarefaService.listar(StatusTarefa.A_FAZER, null))
            .willReturn(List.of(tarefaResponse(1L, StatusTarefa.A_FAZER)));

        mockMvc.perform(get("/api/tarefas").param("status", "A_FAZER"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].status").value("A_FAZER"));
    }

    @Test
    void shouldUpdateTarefaStatus() throws Exception {
        given(tarefaService.atualizarStatus(eq(1L), any(TarefaStatusUpdateRequest.class)))
            .willReturn(tarefaResponse(1L, StatusTarefa.CONCLUIDO));

        TarefaStatusUpdateRequest request = new TarefaStatusUpdateRequest(StatusTarefa.CONCLUIDO);

        mockMvc.perform(patch("/api/tarefas/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("CONCLUIDO"));
    }

    private TarefaResponse tarefaResponse(Long id, StatusTarefa status) {
        LocalDateTime now = LocalDateTime.now();
        return new TarefaResponse(
            id,
            "Separar materiais",
            "Lista inicial",
            status,
            PrioridadeTarefa.MEDIA,
            LocalDateTime.of(2026, 3, 20, 10, 0),
            1L,
            "Rotina semanal",
            null,
            null,
            now,
            now
        );
    }
}
