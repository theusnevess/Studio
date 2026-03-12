package com.studioflow.backend.repository;

import com.studioflow.backend.entity.Projeto;
import com.studioflow.backend.entity.enums.StatusProjeto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a dados das frentes operacionais.
 */
public interface ProjetoRepository extends JpaRepository<Projeto, Long> {

    /**
     * Lista todos os projetos ordenados por nome.
     *
     * @return lista ordenada de projetos
     */
    List<Projeto> findAllByOrderByNomeAsc();

    /**
     * Lista projetos por status ordenados por nome.
     *
     * @param status status atual da frente operacional
     * @return lista de projetos filtrados
     */
    List<Projeto> findAllByStatusOrderByNomeAsc(StatusProjeto status);
}
