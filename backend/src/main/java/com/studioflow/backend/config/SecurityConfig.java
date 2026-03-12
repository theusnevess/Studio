package com.studioflow.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuracao inicial de seguranca da aplicacao.
 *
 * <p>Nesta etapa do projeto, a seguranca existe apenas para estruturar a base
 * do backend sem implementar autenticacao completa. O endpoint de healthcheck
 * permanece publico para facilitar validacao local e monitoramento basico.
 */
@Configuration
public class SecurityConfig {

    /**
     * Define a cadeia principal de filtros de seguranca do Spring Security.
     *
     * <p>Decisoes desta etapa:
     * <p>- desabilitar CSRF para simplificar testes iniciais de API
     * <p>- liberar acesso ao endpoint de healthcheck
     * <p>- exigir autenticacao para quaisquer outros endpoints futuros
     * <p>- manter HTTP Basic apenas como mecanismo tecnico temporario
     *
     * @param http objeto de configuracao HTTP do Spring Security
     * @return cadeia de filtros pronta para ser registrada no contexto
     * @throws Exception caso ocorra falha durante a construcao da configuracao
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF fica desabilitado nesta base inicial porque ainda nao ha
            // formularios autenticados nem fluxo completo de sessao.
            .csrf(AbstractHttpConfigurer::disable)
            // O healthcheck precisa continuar publico para facilitar a subida
            // local do projeto e a verificacao rapida da API.
            // Nesta etapa, Cliente, Projeto, Tarefa e Agendamento tambem ficam publicos para
            // permitir evolucao funcional sem JWT.
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(
                    "/api/health",
                    "/api/clientes/**",
                    "/api/projetos/**",
                    "/api/tarefas/**",
                    "/api/agendamentos/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            // O HTTP Basic serve apenas como suporte tecnico minimo enquanto
            // o projeto ainda nao possui JWT ou login real implementado.
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
