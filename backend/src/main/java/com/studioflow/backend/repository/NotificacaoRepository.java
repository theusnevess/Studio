package com.studioflow.backend.repository;

import com.studioflow.backend.entity.Notificacao;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de acesso a dados das notificacoes internas.
 */
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    /**
     * Lista todas as notificacoes ordenadas pela data de envio.
     *
     * @return lista ordenada de notificacoes
     */
    List<Notificacao> findAllByOrderByDataHoraEnvioDesc();

    /**
     * Lista notificacoes de uma pessoa usuaria ordenadas pela data de envio.
     *
     * @param usuarioId identificador da pessoa usuaria
     * @return lista ordenada das notificacoes do usuario
     */
    List<Notificacao> findAllByUsuarioIdOrderByDataHoraEnvioDesc(Long usuarioId);

    /**
     * Lista notificacoes filtrando por visualizacao.
     *
     * @param visualizada status de visualizacao
     * @return lista filtrada
     */
    List<Notificacao> findAllByVisualizadaOrderByDataHoraEnvioDesc(Boolean visualizada);

    /**
     * Lista notificacoes filtrando por usuario e visualizacao.
     *
     * @param usuarioId identificador da pessoa usuaria
     * @param visualizada status de visualizacao
     * @return lista filtrada
     */
    List<Notificacao> findAllByUsuarioIdAndVisualizadaOrderByDataHoraEnvioDesc(
        Long usuarioId,
        Boolean visualizada
    );
}
