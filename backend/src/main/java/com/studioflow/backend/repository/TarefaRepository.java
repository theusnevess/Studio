package com.studioflow.backend.repository;

import com.studioflow.backend.entity.Tarefa;
import com.studioflow.backend.entity.enums.StatusTarefa;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a dados das tarefas operacionais.
 */
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    /**
     * Lista tarefas por status ordenadas por vencimento.
     *
     * @param status estado atual da tarefa
     * @return lista de tarefas compatíveis com o filtro
     */
    List<Tarefa> findAllByStatusOrderByDataVencimentoAsc(StatusTarefa status);
}
