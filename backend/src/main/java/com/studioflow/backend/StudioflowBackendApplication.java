package com.studioflow.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe de entrada do backend do StudioFlow.
 *
 * <p>Por enquanto, esta aplicacao apenas inicializa o contexto do Spring Boot
 * com a configuracao basica do projeto. Nas proximas etapas, ela continuara
 * sendo o ponto central de bootstrap da API.
 */
@SpringBootApplication
public class StudioflowBackendApplication {

    /**
     * Inicializa a aplicacao Spring Boot.
     *
     * @param args argumentos recebidos pela linha de comando
     */
    public static void main(String[] args) {
        SpringApplication.run(StudioflowBackendApplication.class, args);
    }

}
