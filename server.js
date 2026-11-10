import express from "express";

const app = express();
const PORT = 3000;


app.get("/", (req, res) => {
  res.send("Bem-vindo à Central de Informações da Escola!");
});


app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    mensagem: 'O servidor está funcionando corretamente.'
  });
});


app.get('/escola', (req, res) => {
  res.json({
    nome: 'Escola Técnica Horizonte',
    cidade: 'São Paulo',
    tipo: 'Ensino Técnico'
  });
});


app.get('/cursos', (req, res) => {
  const cursos = [
    { id: 1, nome: 'Desenvolvimento de Sistemas' },
    { id: 2, nome: 'Redes de Computadores' },
    { id: 3, nome: 'Administração' }
  ];

  res.json(cursos);
});

app.get('/professor', (req, res) => {
  res.json({
    nome: 'Carlos Oliveira',
    disciplina: 'Programação Back-End'
  });
});


app.get('/ajuda', (req, res) => {
  res.send(
    'Rotas disponíveis:\n' +
    '/ - Página inicial e boas-vindas.\n' +
    '/status - Verifica se o servidor está online.\n' +
    '/escola - Exibe informações da instituição.\n' +
    '/cursos - Lista os cursos disponíveis.\n' +
    '/professor - Exibe informações do professor.\n' +
    '/ajuda - Apresenta esta lista de orientações.\n' +
    '/requisicao - Exibe dados da requisição recebida.'
  );
});



app.get('/requisicao', (req, res) => {
  res.json({
    metodo: req.method,
    caminho: req.path,
    mensagem: 'Requisição recebida com sucesso.'
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// sprint 02

function criarMensagem(id,usuario,texto){
    return{ id, usuario: usuario.trim(), texto:texto.trim()}
}

const mensagens =[
    criarMensagem (1,'Heloisa', 'Olá, Turma !'),
    criarMensagem (2,'Chiara', 'Servidor funciona TOP'),
    criarMensagem (3,'Laura', 'Vamos conversar com o mensageiro local'),
];

function listaMensagem(){
    return mensagens;
};

function quantidadeDeMensagens(){
    return mensagens.length
};


function buscarMensagem(id){
    return mensagens.find(mensagens => mensagens.id === id)
};

app.get('/',(req,res) => res.send ('Servidor rodando'));
app.get('/status',(req,res) => res.json ({status:'online', sprint :2, total:quantidadeDeMensagens()}));
app.get('/sobre',(req,res) => res.send ('Meu primeiro servidor Node.js com Express e ES Modules.'));


//
app.get('/mensagens', (req,res) => res.json(listaMensagem()));
app.get('/total-mensagens', (req, res) => res.json({total: quantidadeDeMensagens()}));
app.get('/mensagens/:id', (req, res) =>{
    const mensagem = buscarMensagem(Number(req.params.id))
    if (!mensagem)
        return res.status(404).json({ erro:'Mensagem não encontrada'})
    res.json(mensagem );
});

app.listen(PORT,()=> console.log(`Servidor em http://localhost:${PORT}`));

function consultar (falahar = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { 
            falahar
            ? reject(new Error('Falhou'))
            : resolve(mensagens);
        }, 1000);
    });
}

// sprint 03

import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// FUNÇÕES AUXILIARES COM PROMISES
function buscarPerfilSimulado(usuario, simularFalha = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simularFalha) {
        reject(new Error("Banco de dados indisponível no momento."));
      } else {
        resolve({
          usuario: usuario,
          status: "Ativo",
          laboratorio: "Lab 04"
        });
      }
    }, 1000);
  });
}

function saudacaoAssincrona(nome) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Olá, ${nome}! Bem-vindo ao Mensageiro Local.`);
    }, 2000);
  });
}

function obterMensagemPorId(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        return reject(new Error("ID inválido: deve ser maior que zero"));
      } else {
        resolve({ id: id, texto: "Mensagem do laboratório" });
      }
    }, 1000);
  });
}

// ROTAS - MÓDULO 2 
app.get("/perfil-then", (req, res) => {
  buscarPerfilSimulado("Carlos", false)
    .then((dados) => res.json(dados))
    .catch((erro) => res.status(500).json({ erro: "Não foi possível carregar o perfil." }));
});

app.get("/saudacao-then", (req, res) => {
  saudacaoAssincrona("Seu Nome")
    .then((mensagem) => res.send(mensagem))
    .catch((erro) => res.status(500).json({ erro: erro.message }));
});

app.get("/mensagem-invalida-then", (req, res) => {
  obterMensagemPorId(-5)
    .then((msg) => res.json(msg))
    .catch((erro) => res.status(500).json({ erro: erro.message }));
});

// ROTAS - MÓDULO 3 
import express from "express";


const app = express();


const PORT = 3000;


const mensagens = [{ id: 1, usuario: "Ana", texto: "Bom dia!" }, { id: 2, usuario: "Pedro", texto: "Olá!" }];


function consultar(simularErro = false) { return new Promise((resolve, reject) => { setTimeout(() => { if (simularErro) return reject(new Error("Falha simulada"));
resolve(mensagens); }, 1000); }); }


app.get("/mensagens-then", (req, res) => { consultar().then(lista => res.json(lista)).catch(() => res.status(500).json({ erro: "Falha na consulta" })); });


app.get("/mensagens-async", async (req, res) => { try { res.json(await consultar()); } catch (erro) { res.status(500).json({ erro: "Falha na consulta" }); } });


app.get("/mensagens-erro", async (req, res) => { try { res.json(await consultar(true)); } catch (erro) { res.status(500).json({ erro: "Falha simulada" }); } });


app.listen(PORT, "0.0.0.0", () => { console.log(`Servidor em http://localhost:${PORT}`); });