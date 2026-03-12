package com.studioflow.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studioflow.backend.dto.usuario.UsuarioRequest;
import com.studioflow.backend.dto.usuario.UsuarioResponse;
import com.studioflow.backend.exception.BusinessException;
import com.studioflow.backend.exception.GlobalExceptionHandler;
import com.studioflow.backend.service.UsuarioService;
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

@WebMvcTest(UsuarioController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UsuarioService usuarioService;

    @Test
    void shouldCreateUsuario() throws Exception {
        given(usuarioService.criar(any(UsuarioRequest.class))).willReturn(usuarioResponse(1L, true));

        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new UsuarioRequest("Maria", "maria@studioflow.com", "123456"))))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.email").value("maria@studioflow.com"));
    }

    @Test
    void shouldRejectDuplicatedEmail() throws Exception {
        given(usuarioService.criar(any(UsuarioRequest.class)))
            .willThrow(new BusinessException("Ja existe um usuario cadastrado com o email informado."));

        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new UsuarioRequest("Maria", "maria@studioflow.com", "123456"))))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Ja existe um usuario cadastrado com o email informado."));
    }

    @Test
    void shouldInactivateUsuario() throws Exception {
        given(usuarioService.inativar(eq(1L))).willReturn(usuarioResponse(1L, false));

        mockMvc.perform(patch("/api/usuarios/1/inativar"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ativo").value(false));
    }

    private UsuarioResponse usuarioResponse(Long id, boolean ativo) {
        LocalDateTime now = LocalDateTime.now();
        return new UsuarioResponse(id, "Maria", "maria@studioflow.com", ativo, now, now);
    }
}
