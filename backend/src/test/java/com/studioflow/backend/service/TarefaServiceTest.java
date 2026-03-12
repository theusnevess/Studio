package com.studioflow.backend.service;

import com.studioflow.backend.dto.tarefa.TarefaRequest;
import com.studioflow.backend.dto.tarefa.TarefaStatusUpdateRequest;
import com.studioflow.backend.entity.Projeto;
import com.studioflow.backend.entity.Tarefa;
import com.studioflow.backend.entity.enums.PrioridadeTarefa;
import com.studioflow.backend.entity.enums.StatusTarefa;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.ProjetoRepository;
import com.studioflow.backend.repository.TarefaRepository;
import com.studioflow.backend.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class TarefaServiceTest {

    @Mock
    private TarefaRepository tarefaRepository;

    @Mock
    private ProjetoRepository projetoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private TarefaService tarefaService;

    @Test
    void shouldCreateTarefaWithValidProjeto() {
        given(projetoRepository.findById(1L)).willReturn(Optional.of(projeto(1L)));
        given(tarefaRepository.save(any(Tarefa.class))).willAnswer(invocation -> {
            Tarefa tarefa = invocation.getArgument(0);
            tarefa.setId(1L);
            return tarefa;
        });

        var response = tarefaService.criar(validRequest(null, 1L));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.projetoId()).isEqualTo(1L);
        assertThat(response.responsavelId()).isNull();
    }

    @Test
    void shouldRejectMissingProjeto() {
        given(projetoRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> tarefaService.criar(validRequest(null, 99L)))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Projeto nao encontrado com id 99.");
    }

    @Test
    void shouldRejectMissingResponsavel() {
        given(projetoRepository.findById(1L)).willReturn(Optional.of(projeto(1L)));
        given(usuarioRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> tarefaService.criar(validRequest(99L, 1L)))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Usuario nao encontrado com id 99.");
    }

    @Test
    void shouldUpdateTarefaStatus() {
        Tarefa tarefa = new Tarefa();
        tarefa.setId(1L);
        tarefa.setTitulo("Separar materiais");
        tarefa.setStatus(StatusTarefa.A_FAZER);
        tarefa.setPrioridade(PrioridadeTarefa.MEDIA);
        tarefa.setProjeto(projeto(1L));

        given(tarefaRepository.findById(1L)).willReturn(Optional.of(tarefa));
        given(tarefaRepository.save(any(Tarefa.class))).willAnswer(invocation -> invocation.getArgument(0));

        var response = tarefaService.atualizarStatus(1L, new TarefaStatusUpdateRequest(StatusTarefa.CONCLUIDO));

        assertThat(response.status()).isEqualTo(StatusTarefa.CONCLUIDO);
    }

    private TarefaRequest validRequest(Long responsavelId, Long projetoId) {
        return new TarefaRequest(
            "Separar materiais",
            "Descricao",
            StatusTarefa.A_FAZER,
            PrioridadeTarefa.MEDIA,
            LocalDateTime.of(2026, 3, 20, 10, 0),
            projetoId,
            responsavelId
        );
    }

    private Projeto projeto(Long id) {
        Projeto projeto = new Projeto();
        projeto.setId(id);
        projeto.setNome("Rotina semanal");
        return projeto;
    }
}
