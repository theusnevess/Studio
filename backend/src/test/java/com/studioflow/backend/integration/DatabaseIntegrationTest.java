package com.studioflow.backend.integration;

import com.studioflow.backend.entity.Usuario;
import com.studioflow.backend.repository.UsuarioRepository;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
class DatabaseIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void shouldApplyMigrationAndExposeMainTables() {
        Integer usuarios = jdbcTemplate.queryForObject(
            "select count(*) from information_schema.tables where table_name = 'usuarios'",
            Integer.class
        );
        Integer clientes = jdbcTemplate.queryForObject(
            "select count(*) from information_schema.tables where table_name = 'clientes'",
            Integer.class
        );
        Integer projetos = jdbcTemplate.queryForObject(
            "select count(*) from information_schema.tables where table_name = 'projetos'",
            Integer.class
        );
        Integer tarefas = jdbcTemplate.queryForObject(
            "select count(*) from information_schema.tables where table_name = 'tarefas'",
            Integer.class
        );
        Integer agendamentos = jdbcTemplate.queryForObject(
            "select count(*) from information_schema.tables where table_name = 'agendamentos'",
            Integer.class
        );
        Integer notificacoes = jdbcTemplate.queryForObject(
            "select count(*) from information_schema.tables where table_name = 'notificacoes'",
            Integer.class
        );

        assertThat(usuarios).isEqualTo(1);
        assertThat(clientes).isEqualTo(1);
        assertThat(projetos).isEqualTo(1);
        assertThat(tarefas).isEqualTo(1);
        assertThat(agendamentos).isEqualTo(1);
        assertThat(notificacoes).isEqualTo(1);
    }

    @Test
    void shouldPersistUsuarioAndEnforceUniqueEmail() {
        Usuario first = new Usuario();
        first.setNome("Maria");
        first.setEmail("maria@studioflow.com");
        first.setSenha("123456");
        first.setAtivo(true);

        Usuario saved = usuarioRepository.saveAndFlush(first);

        assertThat(saved.getId()).isNotNull();
        Map<String, Object> row = jdbcTemplate.queryForMap(
            "select email, ativo from usuarios where id = ?",
            saved.getId()
        );
        assertThat(row.get("email")).isEqualTo("maria@studioflow.com");
        assertThat(row.get("ativo")).isEqualTo(true);

        Usuario duplicate = new Usuario();
        duplicate.setNome("Maria 2");
        duplicate.setEmail("maria@studioflow.com");
        duplicate.setSenha("654321");
        duplicate.setAtivo(true);

        assertThatThrownBy(() -> usuarioRepository.saveAndFlush(duplicate))
            .isInstanceOf(DataIntegrityViolationException.class);
    }
}
