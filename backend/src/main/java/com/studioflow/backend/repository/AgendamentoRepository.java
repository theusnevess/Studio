package com.studioflow.backend.repository;

import com.studioflow.backend.entity.Agendamento;
import com.studioflow.backend.entity.enums.StatusAgendamento;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a dados dos agendamentos.
 */
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    /**
     * Lista todos os agendamentos ordenados pelo inicio.
     *
     * @return lista ordenada de agendamentos
     */
    List<Agendamento> findAllByOrderByDataHoraInicioAsc();

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

    /**
     * Lista agendamentos por status ordenados pelo inicio.
     *
     * @param status status do agendamento
     * @return lista filtrada
     */
    List<Agendamento> findAllByStatusOrderByDataHoraInicioAsc(StatusAgendamento status);

    /**
     * Lista agendamentos por cliente ordenados pelo inicio.
     *
     * @param clienteId identificador da cliente
     * @return lista filtrada
     */
    List<Agendamento> findAllByClienteIdOrderByDataHoraInicioAsc(Long clienteId);

    /**
     * Lista agendamentos por status e cliente ordenados pelo inicio.
     *
     * @param status status do agendamento
     * @param clienteId identificador da cliente
     * @return lista filtrada
     */
    List<Agendamento> findAllByStatusAndClienteIdOrderByDataHoraInicioAsc(
        StatusAgendamento status,
        Long clienteId
    );
}
