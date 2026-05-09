package com.example.crud_cliente.repository;

import com.example.crud_cliente.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
}