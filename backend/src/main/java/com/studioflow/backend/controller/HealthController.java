package com.studioflow.backend.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller responsavel pelo endpoint de verificacao de saude da API.
 *
 * <p>Este endpoint e util para confirmar rapidamente que o backend iniciou
 * corretamente e esta respondendo requisicoes HTTP.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    /**
     * Retorna uma resposta simples indicando que a API esta operacional.
     *
     * @return mapa simples com o status da aplicacao
     */
    @GetMapping
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
