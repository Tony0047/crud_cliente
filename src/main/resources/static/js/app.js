const API = 'http://localhost:8080/pessoas';

async function checkApi() {
    const dot = document.getElementById('statusDot');
    const label = document.getElementById('statusLabel');
    try {
        const r = await fetch(API, { signal: AbortSignal.timeout(3000) });
        if (r.ok) {
            dot.className = 'dot online';
            label.textContent = 'API online';
        } else {
            throw new Error();
        }
    } catch {
        dot.className = 'dot offline';
        label.textContent = 'API offline';
    }
}

async function listar() {
    try {
        const r = await fetch(API);
        if (!r.ok) throw new Error();
        const dados = await r.json();
        renderTable(dados);
    } catch {
        renderEmpty('Não foi possível conectar à API. Verifique se o Spring Boot está rodando.');
    }
}

function renderTable(dados) {
    const tbody = document.getElementById('tableBody');
    const badge = document.getElementById('totalBadge');
    badge.textContent = `${dados.length} pessoa${dados.length !== 1 ? 's' : ''}`;

    if (dados.length === 0) {
        renderEmpty('Nenhuma pessoa cadastrada ainda.');
        return;
    }

    tbody.innerHTML = dados.map(p => `
    <tr>
      <td class="id-col">#${p.id}</td>
      <td>${esc(p.nome)}</td>
      <td>${esc(p.email)}</td>
      <td>${esc(p.telefone)}</td>
      <td class="actions-col">
        <div class="actions-group">
          <button class="btn-icon btn-edit" onclick="editar(${p.id}, '${esc(p.nome)}', '${esc(p.email)}', '${esc(p.telefone)}')">Editar</button>
          <button class="btn-icon btn-delete" onclick="deletar(${p.id})">Excluir</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderEmpty(msg) {
    document.getElementById('tableBody').innerHTML = `
    <tr><td colspan="5">
      <div class="empty-state"><div class="icon">◌</div>${msg}</div>
    </td></tr>`;
}

async function salvar() {
    const id = document.getElementById('pessoaId').value;
    const body = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
    };

    if (!body.nome) { toast('Informe o nome.', 'error'); return; }

    try {
        const url = id ? `${API}/${id}` : API;
        const method = id ? 'PUT' : 'POST';
        const r = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!r.ok) throw new Error();
        toast(id ? 'Pessoa atualizada.' : 'Pessoa cadastrada.', 'success');
        limpar();
        listar();
    } catch {
        toast('Erro ao salvar. Verifique a API.', 'error');
    }
}

async function deletar(id) {
    if (!confirm(`Excluir a pessoa #${id}?`)) return;
    try {
        const r = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (!r.ok) throw new Error();
        toast('Pessoa excluída.', 'success');
        listar();
    } catch {
        toast('Erro ao excluir.', 'error');
    }
}

function editar(id, nome, email, telefone) {
    document.getElementById('pessoaId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    document.getElementById('telefone').value = telefone;
    document.getElementById('editingId').textContent = `#${id}`;
    document.getElementById('editingBanner').classList.add('visible');
    document.getElementById('nome').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limpar() {
    document.getElementById('pessoaId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('editingBanner').classList.remove('visible');
}

function toast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
    c.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

checkApi();
listar();