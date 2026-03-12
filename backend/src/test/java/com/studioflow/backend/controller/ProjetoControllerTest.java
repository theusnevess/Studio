package com.studioflow.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studioflow.backend.dto.projeto.ProjetoRequest;
import com.studioflow.backend.dto.projeto.ProjetoResponse;
import com.studioflow.backend.dto.projeto.ProjetoStatusUpdateRequest;
import com.studioflow.backend.entity.enums.StatusProjeto;
import com.studioflow.backend.exception.GlobalExceptionHandler;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.service.ProjetoService;
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

@WebMvcTest(ProjetoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ProjetoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjetoService projetoService;

    @Test
    void shouldCreateProjeto() throws Exception {
        given(projetoService.criar(any(ProjetoRequest.class))).willReturn(projetoResponse(1L, StatusProjeto.PLANEJADO));

        ProjetoRequest request = new ProjetoRequest("Rotina semanal", "Organizacao semanal", StatusProjeto.PLANEJADO);

        mockMvc.perform(post("/api/projetos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("PLANEJADO"));
    }

    @Test
    void shouldRejectProjetoWithoutStatus() throws Exception {
        String payload = """
            {
              "nome": "Projeto teste",
              "descricao": "Descricao"
            }
            """;

        mockMvc.perform(post("/api/projetos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("status")));
    }

    @Test
    void shouldFilterProjetosByStatus() throws Exception {
        given(projetoService.listar(StatusProjeto.PLANEJADO))
            .willReturn(List.of(projetoResponse(1L, StatusProjeto.PLANEJADO)));

        mockMvc.perform(get("/api/projetos").param("status", "PLANEJADO"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].status").value("PLANEJADO"));
    }

    @Test
    void shouldReturnNotFoundForMissingProjeto() throws Exception {
        given(projetoService.buscarPorId(99L))
            .willThrow(new ResourceNotFoundException("Projeto nao encontrado com id 99."));

        mockMvc.perform(get("/api/projetos/99"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Projeto nao encontrado com id 99."));
    }

    @Test
    void shouldUpdateProjetoStatus() throws Exception {
        given(projetoService.atualizarStatus(eq(1L), any(ProjetoStatusUpdateRequest.class)))
            .willReturn(projetoResponse(1L, StatusProjeto.CONCLUIDO));

        ProjetoStatusUpdateRequest request = new ProjetoStatusUpdateRequest(StatusProjeto.CONCLUIDO);

        mockMvc.perform(patch("/api/projetos/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("CONCLUIDO"));
    }

    private ProjetoResponse projetoResponse(Long id, StatusProjeto status) {
        LocalDateTime now = LocalDateTime.now();
        return new ProjetoResponse(id, "Rotina semanal", "Organizacao semanal", status, now, now);
    }
}
