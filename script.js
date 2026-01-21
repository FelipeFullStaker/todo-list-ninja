// ===== VARIÁVEIS GLOBAIS NINJA =====
let tarefas = [];  // Array que guarda todas as tarefas
let idContador = 0; // Contador único pra cada tarefa

// ===== ELEMENTOS DO DOM =====
const inputNovaTarefa = document.getElementById('novaTarefa');
const btnAdicionar = document.getElementById('adicionarBtn');
const listaTarefas = document.getElementById('listaTarefas');
const mensagemVazia = document.getElementById('mensagemVazia');
const totalTarefas = document.getElementById('totalTarefas');
const tarefasFeitas = document.getElementById('tarefasFeitas');
const btnLimparCompletadas = document.getElementById('limparCompletadas');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Carrega tarefas salvas do navegador
    carregarTarefas();
    
    // Configura eventos
    configurarEventos();
    
    // Renderiza tudo
    renderizarTarefas();
});

// ===== CONFIGURAR EVENTOS =====
function configurarEventos() {
    // Botão adicionar
    btnAdicionar.addEventListener('click', adicionarTarefa);
    
    // Enter no input também adiciona
    inputNovaTarefa.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adicionarTarefa();
        }
    });
    
    // Botão limpar completadas
    btnLimparCompletadas.addEventListener('click', limparCompletadas);
}

// ===== FUNÇÃO ADICIONAR TAREFA =====
function adicionarTarefa() {
    const textoTarefa = inputNovaTarefa.value.trim();
    
    // Validação ninja
    if (textoTarefa === '') {
        mostrarNotificacao('Digite uma tarefa primeiro! 🥷', 'erro');
        inputNovaTarefa.focus();
        return;
    }
    
    // Cria objeto tarefa
    const novaTarefa = {
        id: idContador++,
        texto: textoTarefa,
        feita: false,
        dataCriacao: new Date().toISOString()
    };
    
    // Adiciona ao array
    tarefas.push(novaTarefa);
    
    // Limpa input
    inputNovaTarefa.value = '';
    inputNovaTarefa.focus();
    
    // Atualiza tudo
    renderizarTarefas();
    salvarTarefas();
    
    // Notificação de sucesso
    mostrarNotificacao('Tarefa adicionada com sucesso! ⚔️', 'sucesso');
}

// ===== FUNÇÃO RENDERIZAR TAREFAS =====
function renderizarTarefas() {
    // Limpa lista
    listaTarefas.innerHTML = '';
    
    // Mostra/esconde mensagem vazia
    if (tarefas.length === 0) {
        mensagemVazia.style.display = 'block';
        btnLimparCompletadas.style.display = 'none';
    } else {
        mensagemVazia.style.display = 'none';
        
        // Verifica se tem tarefas completadas
        const temCompletadas = tarefas.some(tarefa => tarefa.feita);
        btnLimparCompletadas.style.display = temCompletadas ? 'block' : 'none';
    }
    
    // Renderiza cada tarefa
    tarefas.forEach((tarefa, index) => {
        const tarefaElement = criarElementoTarefa(tarefa, index);
        listaTarefas.appendChild(tarefaElement);
    });
    
    // Atualiza contadores
    atualizarContadores();
}

// ===== CRIAR ELEMENTO TAREFA =====
function criarElementoTarefa(tarefa, index) {
    // Cria div principal
    const tarefaDiv = document.createElement('div');
    tarefaDiv.className = `tarefa ${tarefa.feita ? 'tarefa-feita' : ''}`;
    tarefaDiv.dataset.id = tarefa.id;
    
    // Cria checkbox customizado
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox-ninja';
    checkbox.checked = tarefa.feita;
    checkbox.addEventListener('change', () => marcarComoFeita(index));
    
    // Cria texto
    const textoSpan = document.createElement('span');
    textoSpan.textContent = tarefa.texto;
    textoSpan.className = 'tarefa-texto';
    textoSpan.addEventListener('click', () => marcarComoFeita(index));
    
    // Cria botão remover
    const btnRemover = document.createElement('button');
    btnRemover.innerHTML = '×';
    btnRemover.className = 'btn-remover';
    btnRemover.addEventListener('click', () => removerTarefa(index));
    
    // Monta estrutura
    tarefaDiv.appendChild(checkbox);
    tarefaDiv.appendChild(textoSpan);
    tarefaDiv.appendChild(btnRemover);
    
    return tarefaDiv;
}

// ===== FUNÇÃO MARCAR COMO FEITA =====
function marcarComoFeita(index) {
    tarefas[index].feita = !tarefas[index].feita;
    renderizarTarefas();
    salvarTarefas();
    
    // Animação ninja
    const tarefaElement = document.querySelector(`[data-id="${tarefas[index].id}"]`);
    if (tarefas[index].feita) {
        tarefaElement.style.animation = 'concluirTarefa 0.5s ease';
    }
}

// ===== FUNÇÃO REMOVER TAREFA =====
function removerTarefa(index) {
    const tarefaRemovida = tarefas[index];
    
    // Animação de remoção ninja
    const tarefaElement = document.querySelector(`[data-id="${tarefaRemovida.id}"]`);
    tarefaElement.style.animation = 'removerTarefa 0.3s ease';
    
    // Remove após animação
    setTimeout(() => {
        tarefas.splice(index, 1);
        renderizarTarefas();
        salvarTarefas();
        mostrarNotificacao('Tarefa removida! 🥷', 'info');
    }, 300);
}

// ===== FUNÇÃO LIMPAR COMPLETADAS =====
function limparCompletadas() {
    const completadas = tarefas.filter(tarefa => tarefa.feita).length;
    
    if (completadas === 0) return;
    
    tarefas = tarefas.filter(tarefa => !tarefa.feita);
    renderizarTarefas();
    salvarTarefas();
    
    mostrarNotificacao(`${completadas} tarefas removidas! ⚔️`, 'sucesso');
}

// ===== ATUALIZAR CONTADORES =====
function atualizarContadores() {
    const total = tarefas.length;
    const feitas = tarefas.filter(tarefa => tarefa.feita).length;
    
    totalTarefas.textContent = total;
    tarefasFeitas.textContent = feitas;
}

// ===== SALVAR NO NAVEGADOR =====
function salvarTarefas() {
    localStorage.setItem('tarefasNinja', JSON.stringify(tarefas));
    localStorage.setItem('idContadorNinja', idContador.toString());
}

// ===== CARREGAR DO NAVEGADOR =====
function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('tarefasNinja');
    const idSalvo = localStorage.getItem('idContadorNinja');
    
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }
    
    if (idSalvo) {
        idContador = parseInt(idSalvo);
    }
}

// ===== NOTIFICAÇÕES =====
function mostrarNotificacao(mensagem, tipo) {
    // Cria elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    
    // Adiciona ao body
    document.body.appendChild(notificacao);
    
    // Animação de entrada
    setTimeout(() => {
        notificacao.classList.add('mostrar');
    }, 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notificacao.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}

// ===== ANIMAÇÕES CSS =====
/*
@keyframes concluirTarefa {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes removerTarefa {
    0% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
}

.notificacao {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
}

.notificacao.mostrar {
    transform: translateX(0);
}

.notificacao-sucesso { background: linear-gradient(45deg, #4ecdc4, #44a08d); }
.notificacao-erro { background: linear-gradient(45deg, #ff4757, #c44569); }
.notificacao-info { background: linear-gradient(45deg, #667eea, #764ba2); }
*/