import express = require('express');
import bodyParser = require("body-parser");
import nodemailer = require("nodemailer")
const cron = require("node-cron");

import {Aluno} from '../common/aluno';
import {Roteiro} from '../common/roteiro';
import {CadastroDeAlunos} from './cadastrodealunos';
import { CadastroDeRoteiros } from './cadastroDeRoteiros';
import {EmailSender} from "./email-sender";
import {SentMessageInfo} from "nodemailer";
import { EmailNotas } from './emailNotas';
import { EmailRoteiros } from './emailRoteiros';

var taserver = express();

var cadastroAlunos: CadastroDeAlunos = new CadastroDeAlunos();
var cadastroRoteiros: CadastroDeRoteiros = new CadastroDeRoteiros();
var emailNotas: EmailNotas = new EmailNotas();
var emailRoteiros: EmailRoteiros = new EmailRoteiros();
var emailSender: EmailSender = new EmailSender();

var allowCrossDomain = function(req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
taserver.use(allowCrossDomain);

taserver.use(bodyParser.json());

taserver.get('/roteiro', function (req: express.Request, res: express.Response) {
  res.send(JSON.stringify(cadastroRoteiros.getRoteiros()));
})

taserver.post('/roteiro', function (req: express.Request, res: express.Response) {
  var roteiro: Roteiro = <Roteiro> req.body; //verificar se é mesmo Aluno!
  roteiro = cadastroRoteiros.cadastrar(roteiro);
  if (roteiro) {
    res.send({"success": "O roteiro foi cadastrado com sucesso"});
  } else {
    res.send({"failure": "O roteiro não pode ser cadastrado"});
  }
})

taserver.put('/roteiro', function (req: express.Request, res: express.Response) {
  var roteiro: Roteiro = <Roteiro> req.body;
  roteiro = cadastroRoteiros.atualizar(roteiro);
  if (roteiro) {
    res.send({"success": "O roteiro foi atualizado com sucesso"});
  } else {
    res.send({"failure": "O roteiro não pode ser atualizado"});
  }
})

taserver.delete('/roteiro', function (req:express.Request, res:express.Response) {
  var nome: string = <string> req.body.nome;
  let sucesso = cadastroRoteiros.remover(nome);
  if (sucesso) {
    res.send({"success": "O roteiro foi removido com sucesso"});
  } else {
    res.send({"failure": "O roteiro não pode ser removido"});
  }
})

taserver.get('/alunos', function (req: express.Request, res: express.Response) {
  res.send(JSON.stringify(cadastroAlunos.getAlunos()));
})

taserver.post('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body; //verificar se é mesmo Aluno!
  aluno = cadastroAlunos.cadastrar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi cadastrado com sucesso"});
  } else {
    res.send({"failure": "O aluno não pode ser cadastrado"});
  }
})

taserver.put('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body;
  aluno = cadastroAlunos.atualizar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi atualizado com sucesso"});
  } else {
    res.send({"failure": "O aluno não pode ser atualizado"});
  }
})

taserver.post("/sendnotas", function (req: express.Request, res: express.Response) {
  var cpf: string = <string> req.body.cpf;
  var aluno: Aluno = cadastroAlunos.getAlunosbyCPF(cpf);
  var msg: boolean = emailNotas.createMail(aluno) !== "Metas invalidas";
  if(msg && emailSender.sendEMail(aluno, "Relatorio",emailNotas.createMail(aluno))){
    res.send({"success": "O relatório foi enviado com sucesso"});
    cadastroAlunos.atualizarEmail(aluno);
  }else{
    res.send({"failure": "O relatório não pôde ser enviado"});
  }
})

taserver.post('/testeEmailRoteiro', function (req: express.Request, res: express.Response) {
  var roteiro: Roteiro = <Roteiro> req.body;
  try {
    for (let j = 0; j < cadastroAlunos.alunos.length; j++) {
      const aluno = cadastroAlunos.alunos[j];
      emailSender.sendEMail(aluno, "Lembrete Roteiro",emailRoteiros.createMail(roteiro, aluno));
      roteiro.enviado = true;
      cadastroRoteiros.atualizar(roteiro);
    }
    res.send({"success": "Os emails foram enviados com sucesso"})
  } catch (err) {
    console.log(err)
    res.send({"failure": "Não foi possivel enviar os emails"});
  }
})

function checkDate(dataRoteiro: string): boolean{
  let dataRoteiroDate: number = Date.parse(dataRoteiro);
  let dataAtual: number =  Date.now();
  if(dataRoteiroDate - dataAtual <= (86400000) && dataRoteiroDate - dataAtual > 0){
    return true;
  }
  return false;
}

cron.schedule("* * * * *", () => {
  console.log("teste");
  for (let i = 0; i < cadastroRoteiros.roteiros.length; i++) {
    const roteiro = cadastroRoteiros.roteiros[i];
    if(checkDate(roteiro.dataDeEntrega ) && roteiro.enviado == false){
      for (let j = 0; j < cadastroAlunos.alunos.length; j++) {
        const aluno = cadastroAlunos.alunos[j];
        emailSender.sendEMail(aluno, "Lembrete de roteiro",emailRoteiros.createMail(roteiro, aluno))
      }
      roteiro.enviado = true;
      cadastroRoteiros.atualizar(roteiro);
    }
  }
});

var server = taserver.listen(3000, function () {
  console.log('Listening on port 3000!')
})

function closeServer(): void {
  server.close();
}

export { server, closeServer }
