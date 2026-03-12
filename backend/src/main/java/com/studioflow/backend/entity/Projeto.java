package com.studioflow.backend.entity;

import com.studioflow.backend.entity.enums.StatusProjeto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Representa uma frente operacional do studio para aderencia ao requisito
 * academico de organizacao por projetos.
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "projetos")
public class Projeto extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Lob
    @Column(name = "descricao")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatusProjeto status = StatusProjeto.PLANEJADO;
}
