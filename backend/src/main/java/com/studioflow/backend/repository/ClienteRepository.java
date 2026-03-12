package com.studioflow.backend.repository;

import com.studioflow.backend.entity.Cliente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a dados de clientes.
 */
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /**
     * Lista todas as clientes ordenadas por nome.
     *
     * @return lista ordenada de clientes
     */
    List<Cliente> findAllByOrderByNomeAsc();

    /**
     * Lista clientes ativos ordenados por nome.
     *
     * @param ativo indicador de situacao da cliente
     * @return lista filtrada e ordenada
     */
    List<Cliente> findAllByAtivoOrderByNomeAsc(Boolean ativo);
}
