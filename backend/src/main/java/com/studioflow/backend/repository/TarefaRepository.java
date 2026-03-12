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
     * Lista todas as tarefas ordenadas por status e vencimento.
     *
     * @return lista ordenada de tarefas
     */
    List<Tarefa> findAllByOrderByStatusAscDataVencimentoAsc();

    /**
     * Lista tarefas por status ordenadas por vencimento.
     *
     * @param status estado atual da tarefa
     * @return lista de tarefas compativeis com o filtro
     */
    List<Tarefa> findAllByStatusOrderByDataVencimentoAsc(StatusTarefa status);

    /**
     * Lista tarefas por projeto ordenadas por status e vencimento.
     *
     * @param projetoId identificador do projeto
     * @return lista de tarefas vinculadas ao projeto
     */
    List<Tarefa> findAllByProjetoIdOrderByStatusAscDataVencimentoAsc(Long projetoId);

    /**
     * Lista tarefas filtrando simultaneamente por status e projeto.
     *
     * @param status status da tarefa
     * @param projetoId identificador do projeto
     * @return lista filtrada de tarefas
     */
    List<Tarefa> findAllByStatusAndProjetoIdOrderByDataVencimentoAsc(
        StatusTarefa status,
        Long projetoId
    );
}
