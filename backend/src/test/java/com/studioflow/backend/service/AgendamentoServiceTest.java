package com.studioflow.backend.service;

import com.studioflow.backend.dto.agendamento.AgendamentoRequest;
import com.studioflow.backend.dto.agendamento.AgendamentoStatusUpdateRequest;
import com.studioflow.backend.entity.Agendamento;
import com.studioflow.backend.entity.Cliente;
import com.studioflow.backend.entity.enums.StatusAgendamento;
import com.studioflow.backend.exception.BusinessException;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.AgendamentoRepository;
import com.studioflow.backend.repository.ClienteRepository;
import com.studioflow.backend.repository.ProjetoRepository;
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
class AgendamentoServiceTest {

    @Mock
    private AgendamentoRepository agendamentoRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ProjetoRepository projetoRepository;

    @InjectMocks
    private AgendamentoService agendamentoService;

    @Test
    void shouldCreateAgendamento() {
        given(clienteRepository.findById(1L)).willReturn(Optional.of(cliente(1L)));
        given(agendamentoRepository.save(any(Agendamento.class))).willAnswer(invocation -> {
            Agendamento agendamento = invocation.getArgument(0);
            agendamento.setId(1L);
            return agendamento;
        });

        var response = agendamentoService.criar(validRequest(1L));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.clienteId()).isEqualTo(1L);
    }

    @Test
    void shouldRejectWhenClienteDoesNotExist() {
        given(clienteRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> agendamentoService.criar(validRequest(99L)))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Cliente nao encontrado com id 99.");
    }

    @Test
    void shouldRejectInvalidInterval() {
        assertThatThrownBy(() -> agendamentoService.criar(new AgendamentoRequest(
            "Atendimento Ana",
            "Banho de gel",
            null,
            LocalDateTime.of(2026, 3, 20, 15, 0),
            LocalDateTime.of(2026, 3, 20, 14, 0),
            StatusAgendamento.AGENDADO,
            1L,
            null,
            null
        ))).isInstanceOf(BusinessException.class)
            .hasMessage("A data e hora de fim devem ser posteriores a data e hora de inicio.");
    }

    @Test
    void shouldUpdateStatus() {
        Agendamento agendamento = new Agendamento();
        agendamento.setId(1L);
        agendamento.setStatus(StatusAgendamento.AGENDADO);
        agendamento.setCliente(cliente(1L));

        given(agendamentoRepository.findById(1L)).willReturn(Optional.of(agendamento));
        given(agendamentoRepository.save(any(Agendamento.class))).willAnswer(invocation -> invocation.getArgument(0));

        var response = agendamentoService.atualizarStatus(1L, new AgendamentoStatusUpdateRequest(StatusAgendamento.CONCLUIDO));

        assertThat(response.status()).isEqualTo(StatusAgendamento.CONCLUIDO);
    }

    private AgendamentoRequest validRequest(Long clienteId) {
        return new AgendamentoRequest(
            "Atendimento Ana",
            "Banho de gel",
            "Cliente fiel",
            LocalDateTime.of(2026, 3, 20, 14, 0),
            LocalDateTime.of(2026, 3, 20, 15, 0),
            StatusAgendamento.AGENDADO,
            clienteId,
            null,
            null
        );
    }

    private Cliente cliente(Long id) {
        Cliente cliente = new Cliente();
        cliente.setId(id);
        cliente.setNome("Ana");
        return cliente;
    }
}
