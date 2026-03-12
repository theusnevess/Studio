package com.studioflow.backend.service;

import com.studioflow.backend.dto.usuario.UsuarioRequest;
import com.studioflow.backend.entity.Usuario;
import com.studioflow.backend.exception.BusinessException;
import com.studioflow.backend.repository.UsuarioRepository;
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
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void shouldCreateUsuario() {
        given(usuarioRepository.existsByEmail("maria@studioflow.com")).willReturn(false);
        given(usuarioRepository.save(any(Usuario.class))).willAnswer(invocation -> invocation.getArgument(0));

        var response = usuarioService.criar(new UsuarioRequest("Maria", "maria@studioflow.com", "123456"));

        assertThat(response.ativo()).isTrue();
        assertThat(response.email()).isEqualTo("maria@studioflow.com");
    }

    @Test
    void shouldRejectDuplicatedEmail() {
        given(usuarioRepository.existsByEmail("maria@studioflow.com")).willReturn(true);

        assertThatThrownBy(() -> usuarioService.criar(new UsuarioRequest("Maria", "maria@studioflow.com", "123456")))
            .isInstanceOf(BusinessException.class)
            .hasMessage("Ja existe um usuario cadastrado com o email informado.");
    }
}
