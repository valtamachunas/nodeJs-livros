//meu servidor

const express = require('express');
const router = express.Router();
const cors = require('cors');

const conectaBancoDeDados = require('./bancoDeDados');
conectaBancoDeDados();

const app = express();

const Livro = require('./livroModel');

app.use(express.json());


app.use(cors());

const porta = 3333;

//GET
async function mostraLivros(request, response) {
    try {
        const livrosDoBanco = await Livro.find();
        response.json(livrosDoBanco);
    }
    catch (erro) {
        console.log(erro)
    }
}

//POST
async function criaLivro(request, response) {
    const novoLivro = new Livro({
        nome: request.body.nome,
        imagem: request.body.imagem,
        resumo: request.body.resumo,
        autor: request.body.autor,
        nota: request.body.nota
    })
    try {
        const livroCriado = await novoLivro.save()
        response.status(201).json(livroCriado)
    }
    catch (erro) {
        console.log(erro)
    }
}

//PATCH
async function corrigeLivro(request, response) {
    try {
        const livroEncontrado = await Livro.findById(request.params.id); //params pega da url

        if (request.body.nome) {
            livroEncontrado.nome = request.body.nome;
        }
        if (request.body.imagem) {
            livroEncontrado.imagem = request.body.imagem;
        }
        if (request.body.resumo) {
            livroEncontrado.resumo = request.body.resumo;
        }
        if (request.body.autor) {
            livroEncontrado.autor = request.body.autor;
        }
        if (request.body.nota) {
            livroEncontrado.nota = request.body.nota;
        }
        const livroAtualizadoNoBanco = await livroEncontrado.save()
        response.json(livroAtualizadoNoBanco)
    }
    catch (erro) {
        console.log(erro)
    }
}

//DELETE
async function deletaLivro(request, response) {
    try {
        await Livro.findByIdAndDelete(request.params.id)
        response.json({ mensagem: "Livro deletado com sucesso!" })
    }
    catch (erro) {
        console.log(erro)
    }

}

//PORTA
function mostraPorta() {
    console.log("A porta é", porta)
}


app.use(router.get('/livros', mostraLivros));
app.use(router.post('/livros', criaLivro));
app.use(router.patch('/livros/:id', corrigeLivro));
app.use(router.delete('/livros/:id', deletaLivro))
app.listen(porta, mostraPorta);

