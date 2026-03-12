package com.studioflow.backend.repository;

import com.studioflow.backend.entity.Agendamento;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a dados dos agendamentos.
 */
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    /**
     * Lista agendamentos cujo inicio esteja dentro de um intervalo.
     *
     * @param inicio data inicial do filtro
     * @param fim data final do filtro
     * @return lista de agendamentos ordenados por inicio
     */
    List<Agendamento> findAllByDataHoraInicioBetweenOrderByDataHoraInicioAsc(
        LocalDateTime inicio,
        LocalDateTime fim
    );
}
