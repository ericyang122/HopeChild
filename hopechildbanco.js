const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");


//configurando o roteamento para teste no postman
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;


//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/hopechild',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    //serverSelectionTimeoutMS : 20000
});


//criando a model do seu projeto
const usuarioSchema = new mongoose.Schema({
    email : {type : String, required: true},
    nome_responsavel : {type : String},
    nome_crianca : {type : String},
    data_nascimento : {type : Date},
    endereco : {type : String},
    genero_crianca : {type : String},
    numeroTelefone : {type : String}

});

const usuario = mongoose.model("usuario", usuarioSchema);

app.post("/cadatrosdahope/cadastrousuario", async (req, res) => {
    const email = req.body.email;
    const nome_responsavel = req.body.nome_responsavel;
    const nome_crianca = req.body.nome_crianca;
    const data_nascimento = req.body.data_nascimento;
    const endereco = req.body.endereco
    const genero_crianca = req.body.genero_crianca;
    const numeroTelefone =req.body.numeroTelefone;
    

    if ( !email ||  !nome_responsavel || !nome_crianca || !data_nascimento || !endereco || !genero_crianca || !numeroTelefone) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    // Testando se o email já existe
    const emailExiste = await usuario.findOne({ email: email });
    if (emailExiste) {
        return res.status(400).json({ error: "Este email já está em uso" });
    }

    // Criando um novo objeto de usuário com o modelo do Mongoose
    const novoUsuario = new usuario({
        email: email,
        nome_responsavel: nome_responsavel,
        nome_crianca: nome_crianca,
        data_nascimento: data_nascimento,
        endereco: endereco,
        genero_crianca: genero_crianca,
        numeroTelefone: numeroTelefone

    });

    try {
        // Salvando o novo usuário no banco de dados
        const usuarioSalvo = await novoUsuario.save();
        res.json({ error: null, msg: "Cadastro realizado com sucesso", usuarioId: usuarioSalvo._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



app.get("/cadatrosdahope/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadatrosdahope/cadastrousuario.html");
})

//rota raiz
app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})
