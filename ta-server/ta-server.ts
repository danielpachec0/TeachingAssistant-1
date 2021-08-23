import express = require('express');
import bodyParser = require("body-parser");
import nodemailer = require("nodemailer")

import {Aluno} from '../common/aluno';
import {CadastroDeAlunos} from './cadastrodealunos';
import {EMailSender} from "./email-sender";
import {SentMessageInfo} from "nodemailer";

var taserver = express();

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

taserver.get('/alunos', function (req: express.Request, res: express.Response) {
  res.send(JSON.stringify(cadastro.getAlunos()));
})

taserver.post('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body; //verificar se é mesmo Aluno!
  aluno = cadastro.cadastrar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi cadastrado com sucesso"});
  } else {
    res.send({"failure": "O aluno não pode ser cadastrado"});
  }
  console.log(cadastro.alunos);
})

taserver.put('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body;
  aluno = cadastro.atualizar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi atualizado com sucesso"});
  } else {
    res.send({"failure": "O aluno não pode ser atualizado"});
  }
})


taserver.post("/sendnotas", function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno>req.body;
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
    if (sendNotas(aluno, "[Média Final]", `Sua média final foi: ${media}\nSituação:${situacao}`) != null) {
      res.send({"success": "O relatório foi enviado com sucesso!"});
    } else {
      res.send({"failure": "O relatório não pôde ser enviado!"});
    }
  } catch (err) {
    console.log(err)
  }

})

var server = taserver.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function calcular_media(aluno: Aluno): Number {
  var mean = 0
  var length = Object.keys(aluno.metas).length
  for (let key in aluno.metas) {
    let value = aluno.metas[key]
    mean += value
  }
  return mean/length
}

async function sendNotas(aluno: Aluno, subject: string,text: string): Promise<SentMessageInfo> {
  return emailSender.sendEMail(aluno, subject, text);
}

function closeServer(): void {
  server.close();
}

export { server, closeServer }
