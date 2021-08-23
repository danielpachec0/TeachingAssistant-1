import express = require('express');
import bodyParser = require("body-parser");
import nodemailer = require("nodemailer")
const cron = require("node-cron");

import {Aluno} from '../common/aluno';
import {Roteiro} from '../common/roteiro';
import {CadastroDeAlunos} from './cadastrodealunos';
import { CadastroDeRoteiros } from './cadastroDeRoteiros';
import {EMailSender} from "./email-sender";
import {SentMessageInfo} from "nodemailer";

var taserver = express();

var cadastroAlunos: CadastroDeAlunos = new CadastroDeAlunos();
var cadastroRoteiros: CadastroDeRoteiros = new CadastroDeRoteiros();
var cadastro: CadastroDeAlunos = new CadastroDeAlunos();
var emailSender: EMailSender = new EMailSender();

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
  console.log(aluno);
  var media: Number = calcular_media(aluno)
  var situacao: String = ""
  try {
    if (media >= 7) {
      situacao = "Aprovado por média"
    } else if (media >= 3) {
      situacao = "Final"
    } else {
      situacao = "Reprovado por média"
    }

    sendNotas(aluno, "[Média Final]", `Sua média final foi: ${media}\nSituação:${situacao}`)
        .then((value) => {
          console.log(value);
          if (value != -0) {
            res.send({"success": "O relatório foi enviado com sucesso!"});
          } else {
            res.send({"failure": "O relatório não pôde ser enviado!"});
          }});
  } catch (err) {
    console.log("Aqui!")
    console.log(err)
  }

})

var server = taserver.listen(3000, function () {
  console.log('Listening on port 3000!')
})

function calcular_media(aluno: Aluno): Number {
  var mean = 0
  var length = Object.keys(aluno.metas).length
  for (let key in aluno.metas) {
    let value = +aluno.metas[key];
    mean += value
  }
  return mean/length
}

async function sendNotas(aluno: Aluno, subject: string,text: string): Promise<number> {
  return-await emailSender.sendEMail(aluno, subject, text);
}

function closeServer(): void {
  server.close();
}

export { server, closeServer }
