package com.studioflow.backend.exception;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders.standaloneSetup(new TestExceptionController())
            .setControllerAdvice(new GlobalExceptionHandler())
            .setValidator(validator)
            .build();
    }

    @Test
    void shouldMapResourceNotFoundTo404() throws Exception {
        mockMvc.perform(get("/test/not-found"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.timestamp").exists())
            .andExpect(jsonPath("$.status").value(404))
            .andExpect(jsonPath("$.error").value("Not Found"))
            .andExpect(jsonPath("$.message").value("Recurso nao encontrado."))
            .andExpect(jsonPath("$.path").value("/test/not-found"));
    }

    @Test
    void shouldMapBusinessExceptionTo400() throws Exception {
        mockMvc.perform(get("/test/business"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.message").value("Regra de negocio invalida."));
    }

    @Test
    void shouldMapValidationErrorTo400() throws Exception {
        mockMvc.perform(post("/test/validation")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("nome")));
    }

    @Test
    void shouldMapUnexpectedErrorTo500() throws Exception {
        mockMvc.perform(get("/test/unexpected"))
            .andExpect(status().isInternalServerError())
            .andExpect(jsonPath("$.status").value(500))
            .andExpect(jsonPath("$.error").value("Internal Server Error"))
            .andExpect(jsonPath("$.message").value("Ocorreu um erro interno inesperado."));
    }

    @RestController
    @RequestMapping("/test")
    static class TestExceptionController {

        @GetMapping("/not-found")
        void notFound() {
            throw new ResourceNotFoundException("Recurso nao encontrado.");
        }

        @GetMapping("/business")
        void business() {
            throw new BusinessException("Regra de negocio invalida.");
        }

        @PostMapping("/validation")
        void validation(@Valid @RequestBody ValidationRequest request) {
        }

        @GetMapping("/unexpected")
        void unexpected() {
            throw new RuntimeException("Erro inesperado.");
        }
    }

    record ValidationRequest(@NotBlank(message = "O nome e obrigatorio.") String nome) {
    }
}
