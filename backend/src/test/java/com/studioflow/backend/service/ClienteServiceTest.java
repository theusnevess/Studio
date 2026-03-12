package com.studioflow.backend.service;

import com.studioflow.backend.dto.cliente.ClienteRequest;
import com.studioflow.backend.entity.Cliente;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.ClienteRepository;
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
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    @Test
    void shouldCreateClienteAsActive() {
        given(clienteRepository.save(any(Cliente.class))).willAnswer(invocation -> invocation.getArgument(0));

        var response = clienteService.criar(new ClienteRequest("Ana", "11999999999", "Cliente fiel"));

        assertThat(response.ativo()).isTrue();
        assertThat(response.nome()).isEqualTo("Ana");
    }

    @Test
    void shouldThrowWhenClienteNotFound() {
        given(clienteRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> clienteService.buscarPorId(99L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("Cliente nao encontrado com id 99.");
    }

    @Test
    void shouldInactivateCliente() {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNome("Ana");
        cliente.setAtivo(true);

        given(clienteRepository.findById(1L)).willReturn(Optional.of(cliente));
        given(clienteRepository.save(any(Cliente.class))).willAnswer(invocation -> invocation.getArgument(0));

        var response = clienteService.inativar(1L);

        assertThat(response.ativo()).isFalse();
        verify(clienteRepository).save(cliente);
    }
}
