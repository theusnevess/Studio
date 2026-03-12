package com.studioflow.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studioflow.backend.dto.cliente.ClienteRequest;
import com.studioflow.backend.dto.cliente.ClienteResponse;
import com.studioflow.backend.exception.GlobalExceptionHandler;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.service.ClienteService;
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

@WebMvcTest(ClienteController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClienteService clienteService;

    @Test
    void shouldCreateClienteWithValidPayload() throws Exception {
        given(clienteService.criar(any(ClienteRequest.class))).willReturn(clienteResponse(1L, true));

        ClienteRequest request = new ClienteRequest("Ana", "11999999999", "Cliente fiel");

        mockMvc.perform(post("/api/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.nome").value("Ana"));
    }

    @Test
    void shouldRejectClienteWithoutNome() throws Exception {
        String payload = """
            {
              "telefone": "11999999999",
              "observacoes": "Sem nome"
            }
            """;

        mockMvc.perform(post("/api/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("nome")));
    }

    @Test
    void shouldGetClienteById() throws Exception {
        given(clienteService.buscarPorId(1L)).willReturn(clienteResponse(1L, true));

        mockMvc.perform(get("/api/clientes/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    void shouldReturnNotFoundForMissingCliente() throws Exception {
        given(clienteService.buscarPorId(99L))
            .willThrow(new ResourceNotFoundException("Cliente nao encontrado com id 99."));

        mockMvc.perform(get("/api/clientes/99"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Cliente nao encontrado com id 99."));
    }

    @Test
    void shouldInactivateCliente() throws Exception {
        given(clienteService.inativar(eq(1L))).willReturn(clienteResponse(1L, false));

        mockMvc.perform(patch("/api/clientes/1/inativar"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ativo").value(false));
    }

    private ClienteResponse clienteResponse(Long id, boolean ativo) {
        LocalDateTime now = LocalDateTime.now();
        return new ClienteResponse(id, "Ana", "11999999999", "Cliente fiel", ativo, now, now);
    }
}
