package com.example.crud_cliente.controller;

import com.example.crud_cliente.model.Pessoa;
import com.example.crud_cliente.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pessoas")
public class PessoaController {

    @Autowired
    private PessoaRepository repository;

    // GET /pessoas — lista todas
    @GetMapping
    public List<Pessoa> listar() {
        return repository.findAll();
    }

    // GET /pessoas/{id} — busca por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> buscarPorId(@PathVariable Long id) {
        Optional<Pessoa> pessoa = repository.findById(id);
        return pessoa.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /pessoas — cria nova pessoa
    @PostMapping
    public Pessoa criar(@RequestBody Pessoa pessoa) {
        return repository.save(pessoa);
    }

    // PUT /pessoas/{id} — atualiza pessoa existente
    @PutMapping("/{id}")
    public ResponseEntity<Pessoa> atualizar(@PathVariable Long id, @RequestBody Pessoa dados) {
        return repository.findById(id).map(pessoa -> {
            pessoa.setNome(dados.getNome());
            pessoa.setEmail(dados.getEmail());
            pessoa.setTelefone(dados.getTelefone());
            return ResponseEntity.ok(repository.save(pessoa));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /pessoas/{id} — remove pessoa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}