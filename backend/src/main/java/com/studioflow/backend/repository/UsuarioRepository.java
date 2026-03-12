package com.studioflow.backend.repository;

import com.studioflow.backend.entity.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a dados de usuarios.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca uma pessoa usuaria pelo email unico.
     *
     * @param email email utilizado no login futuro
     * @return usuario encontrado, se existir
     */
    Optional<Usuario> findByEmail(String email);
}
