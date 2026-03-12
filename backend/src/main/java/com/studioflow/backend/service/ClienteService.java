package com.studioflow.backend.service;

import com.studioflow.backend.dto.cliente.ClienteRequest;
import com.studioflow.backend.dto.cliente.ClienteResponse;
import com.studioflow.backend.entity.Cliente;
import com.studioflow.backend.exception.ResourceNotFoundException;
import com.studioflow.backend.repository.ClienteRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsavel pelos casos de uso de clientes.
 */
@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    /**
     * Cria uma nova cliente sempre com status ativo por padrao.
     *
     * @param request dados recebidos da API
     * @return cliente criada
     */
    @Transactional
    public ClienteResponse criar(ClienteRequest request) {
        Cliente cliente = new Cliente();
        cliente.setAtivo(true);
        applyRequest(cliente, request);

        return toResponse(clienteRepository.save(cliente));
    }

    /**
     * Busca uma cliente pelo identificador.
     *
     * @param id identificador da cliente
     * @return cliente encontrada
     */
    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        return toResponse(findEntityById(id));
    }

    /**
     * Lista clientes, com opcao de filtrar por status ativo.
     *
     * @param ativo filtro opcional de atividade
     * @return lista de clientes
     */
    @Transactional(readOnly = true)
    public List<ClienteResponse> listar(Boolean ativo) {
        List<Cliente> clientes = ativo == null
            ? clienteRepository.findAllByOrderByNomeAsc()
            : clienteRepository.findAllByAtivoOrderByNomeAsc(ativo);

        return clientes.stream().map(this::toResponse).toList();
    }

    /**
     * Atualiza os dados principais de uma cliente.
     *
     * @param id identificador da cliente
     * @param request dados atualizados
     * @return cliente atualizada
     */
    @Transactional
    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        Cliente cliente = findEntityById(id);
        applyRequest(cliente, request);

        return toResponse(clienteRepository.save(cliente));
    }

    /**
     * Inativa logicamente uma cliente sem remover o registro do banco.
     *
     * @param id identificador da cliente
     * @return cliente inativada
     */
    @Transactional
    public ClienteResponse inativar(Long id) {
        Cliente cliente = findEntityById(id);
        cliente.setAtivo(false);

        return toResponse(clienteRepository.save(cliente));
    }

    private Cliente findEntityById(Long id) {
        return clienteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado com id " + id + "."));
    }

    private void applyRequest(Cliente cliente, ClienteRequest request) {
        cliente.setNome(request.nome().trim());
        cliente.setTelefone(normalize(request.telefone()));
        cliente.setObservacoes(normalize(request.observacoes()));
    }

    private ClienteResponse toResponse(Cliente cliente) {
        return new ClienteResponse(
            cliente.getId(),
            cliente.getNome(),
            cliente.getTelefone(),
            cliente.getObservacoes(),
            cliente.getAtivo(),
            cliente.getCreatedAt(),
            cliente.getUpdatedAt()
        );
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
