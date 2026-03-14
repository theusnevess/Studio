package com.studioflow.backend.config;

import com.studioflow.backend.entity.Agendamento;
import com.studioflow.backend.entity.Cliente;
import com.studioflow.backend.entity.Projeto;
import com.studioflow.backend.entity.Tarefa;
import com.studioflow.backend.entity.Usuario;
import com.studioflow.backend.entity.enums.PrioridadeTarefa;
import com.studioflow.backend.entity.enums.StatusAgendamento;
import com.studioflow.backend.entity.enums.StatusProjeto;
import com.studioflow.backend.entity.enums.StatusTarefa;
import com.studioflow.backend.repository.AgendamentoRepository;
import com.studioflow.backend.repository.ClienteRepository;
import com.studioflow.backend.repository.ProjetoRepository;
import com.studioflow.backend.repository.TarefaRepository;
import com.studioflow.backend.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Seed simples para ambiente de desenvolvimento.
 *
 * <p>O objetivo e garantir dados suficientes para deixar o frontend
 * imediatamente funcional no ambiente local sem depender de cadastro manual.
 */
@Configuration
@Profile({"dev", "demo"})
public class DevDataSeederConfig {

    @Bean
    CommandLineRunner seedDevData(
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository,
            ProjetoRepository projetoRepository,
            TarefaRepository tarefaRepository,
            AgendamentoRepository agendamentoRepository
    ) {
        return args -> {
            Usuario usuarioBase = ensureUsuario(usuarioRepository);
            Projeto projetoBase = ensureProjeto(projetoRepository);
            List<Cliente> clientes = ensureClientes(clienteRepository);

            ensureTarefas(tarefaRepository, projetoBase, usuarioBase);
            ensureAgendamentos(agendamentoRepository, clientes, projetoBase, usuarioBase);
        };
    }

    private Usuario ensureUsuario(UsuarioRepository usuarioRepository) {
        if (usuarioRepository.count() > 0) {
            return usuarioRepository.findAllByOrderByNomeAsc().getFirst();
        }

        Usuario usuario = new Usuario();
        usuario.setNome("Nathallya Soares");
        usuario.setEmail("nathallya@studioflow.dev");
        usuario.setSenha("123456");
        usuario.setAtivo(true);
        return usuarioRepository.save(usuario);
    }

    private Projeto ensureProjeto(ProjetoRepository projetoRepository) {
        if (projetoRepository.count() > 0) {
            return projetoRepository.findAllByOrderByNomeAsc().getFirst();
        }

        Projeto projeto = new Projeto();
        projeto.setNome("Rotina semanal");
        projeto.setDescricao("Organizacao operacional da semana, atendimentos e tarefas recorrentes do studio.");
        projeto.setStatus(StatusProjeto.EM_ANDAMENTO);
        return projetoRepository.save(projeto);
    }

    private List<Cliente> ensureClientes(ClienteRepository clienteRepository) {
        if (clienteRepository.count() == 0) {
            clienteRepository.saveAll(List.of(
                    buildCliente(
                            "Ana Luiza Martins",
                            "(11) 99871-2045",
                            "Prefere atendimento no periodo da tarde e tons nude."
                    ),
                    buildCliente(
                            "Beatriz Fernandes",
                            "(11) 99752-1184",
                            "Costuma agendar manutencao a cada 20 dias."
                    ),
                    buildCliente(
                            "Camila Araujo",
                            "(11) 99134-5520",
                            "Gosta de alongamento em gel e decoracoes delicadas."
                    ),
                    buildCliente(
                            "Daniela Souza",
                            "(11) 99403-7611",
                            "Atendimento geralmente aos sabados pela manha."
                    ),
                    buildCliente(
                            "Fernanda Lima",
                            "(11) 99661-3329",
                            "Cliente recorrente; prefere esmaltes rosados."
                    ),
                    buildCliente(
                            "Juliana Costa",
                            "(11) 99912-8470",
                            "Tem sensibilidade a produtos com cheiro muito forte."
                    )
            ));
        }

        return clienteRepository.findAllByAtivoOrderByNomeAsc(true);
    }

    private void ensureTarefas(
            TarefaRepository tarefaRepository,
            Projeto projetoBase,
            Usuario usuarioBase
    ) {
        if (tarefaRepository.count() > 0) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        tarefaRepository.saveAll(List.of(
                buildTarefa(
                        "Separar materiais para os atendimentos",
                        "Organizar esmaltes, lixas e cabines para os horarios confirmados.",
                        StatusTarefa.A_FAZER,
                        PrioridadeTarefa.ALTA,
                        now.plusDays(1).withHour(9).withMinute(0),
                        projetoBase,
                        usuarioBase
                ),
                buildTarefa(
                        "Confirmar agenda de sexta-feira",
                        "Revisar a lista de clientes do fim de semana e checar retornos.",
                        StatusTarefa.EM_ANDAMENTO,
                        PrioridadeTarefa.MEDIA,
                        now.plusDays(2).withHour(18).withMinute(0),
                        projetoBase,
                        usuarioBase
                ),
                buildTarefa(
                        "Atualizar vitrine de cores da semana",
                        "Selecionar cores em alta e preparar referencias para divulgacao interna.",
                        StatusTarefa.A_FAZER,
                        PrioridadeTarefa.BAIXA,
                        now.plusDays(3).withHour(11).withMinute(30),
                        projetoBase,
                        null
                ),
                buildTarefa(
                        "Revisar fichas das clientes recorrentes",
                        "Conferir observacoes e preferencias antes dos proximos atendimentos.",
                        StatusTarefa.CONCLUIDO,
                        PrioridadeTarefa.MEDIA,
                        now.minusDays(1).withHour(16).withMinute(0),
                        projetoBase,
                        usuarioBase
                )
        ));
    }

    private void ensureAgendamentos(
            AgendamentoRepository agendamentoRepository,
            List<Cliente> clientes,
            Projeto projetoBase,
            Usuario usuarioBase
    ) {
        if (agendamentoRepository.count() > 0 || clientes.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        agendamentoRepository.saveAll(List.of(
                buildAgendamento(
                        "Manutencao da Ana",
                        "Manutencao em gel",
                        "Cliente prefere acabamento delicado e tons suaves.",
                        now.plusDays(1).withHour(14).withMinute(0),
                        now.plusDays(1).withHour(15).withMinute(30),
                        StatusAgendamento.AGENDADO,
                        clientes.get(0),
                        usuarioBase,
                        projetoBase
                ),
                buildAgendamento(
                        "Alongamento da Beatriz",
                        "Alongamento",
                        "Separar referencias florais para inspiracao.",
                        now.plusDays(2).withHour(10).withMinute(0),
                        now.plusDays(2).withHour(12).withMinute(0),
                        StatusAgendamento.CONFIRMADO,
                        clientes.get(1),
                        usuarioBase,
                        projetoBase
                ),
                buildAgendamento(
                        "Banho de gel da Camila",
                        "Banho de gel",
                        "Atendimento rapido com foco em reforco da estrutura.",
                        now.plusDays(3).withHour(16).withMinute(30),
                        now.plusDays(3).withHour(17).withMinute(45),
                        StatusAgendamento.AGENDADO,
                        clientes.get(2),
                        usuarioBase,
                        projetoBase
                ),
                buildAgendamento(
                        "Decoracao da Fernanda",
                        "Decoracao artistica",
                        "Cliente quer detalhes florais discretos.",
                        now.minusDays(1).withHour(13).withMinute(0),
                        now.minusDays(1).withHour(14).withMinute(20),
                        StatusAgendamento.CONCLUIDO,
                        clientes.get(4),
                        usuarioBase,
                        projetoBase
                )
        ));
    }

    private Cliente buildCliente(String nome, String telefone, String observacoes) {
        Cliente cliente = new Cliente();
        cliente.setNome(nome);
        cliente.setTelefone(telefone);
        cliente.setObservacoes(observacoes);
        cliente.setAtivo(true);
        return cliente;
    }

    private Tarefa buildTarefa(
            String titulo,
            String descricao,
            StatusTarefa status,
            PrioridadeTarefa prioridade,
            LocalDateTime dataVencimento,
            Projeto projeto,
            Usuario responsavel
    ) {
        Tarefa tarefa = new Tarefa();
        tarefa.setTitulo(titulo);
        tarefa.setDescricao(descricao);
        tarefa.setStatus(status);
        tarefa.setPrioridade(prioridade);
        tarefa.setDataVencimento(dataVencimento);
        tarefa.setProjeto(projeto);
        tarefa.setResponsavel(responsavel);
        return tarefa;
    }

    private Agendamento buildAgendamento(
            String titulo,
            String servico,
            String observacoes,
            LocalDateTime inicio,
            LocalDateTime fim,
            StatusAgendamento status,
            Cliente cliente,
            Usuario responsavel,
            Projeto projeto
    ) {
        Agendamento agendamento = new Agendamento();
        agendamento.setTitulo(titulo);
        agendamento.setServico(servico);
        agendamento.setObservacoes(observacoes);
        agendamento.setDataHoraInicio(inicio);
        agendamento.setDataHoraFim(fim);
        agendamento.setStatus(status);
        agendamento.setCliente(cliente);
        agendamento.setResponsavel(responsavel);
        agendamento.setProjeto(projeto);
        return agendamento;
    }
}
