package com.studioflow.backend.repository;

import com.studioflow.backend.entity.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a dados de usuarios.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Lista usuarios ordenados por nome.
     *
     * @return lista ordenada de usuarios
     */
    List<Usuario> findAllByOrderByNomeAsc();

    /**
     * Busca uma pessoa usuaria pelo email unico.
     *
     * @param email email utilizado no login futuro
     * @return usuario encontrado, se existir
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica se existe usuario com o email informado.
     *
     * @param email email a verificar
     * @return true quando existir um usuario com esse email
     */
    boolean existsByEmail(String email);

    /**
     * Verifica se existe usuario com o email informado e id diferente do atual.
     *
     * @param email email a verificar
     * @param id identificador a desconsiderar na verificacao
     * @return true quando existir outro usuario com esse email
     */
    boolean existsByEmailAndIdNot(String email, Long id);
}
