import express = require('express');
import bodyParser = require("body-parser");
import nodemailer = require("nodemailer");
const cron = require("node-cron");

import {Aluno} from '../common/aluno';
import {Roteiro} from '../common/roteiro';
import {CadastroDeAlunos} from './cadastrodealunos';
import { CadastroDeRoteiros } from './cadastroDeRoteiros';

var taserver = express();

var cadastroAlunos: CadastroDeAlunos = new CadastroDeAlunos();
var cadastroRoteiros: CadastroDeRoteiros = new CadastroDeRoteiros();

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
    res.send({"success": "O aluno foi atualizado com sucesso"});
  } else {
    res.send({"failure": "O aluno não pode ser atualizado"});
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

var server = taserver.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

async function sendMailRoteiro(alunos: Aluno[], nomeRoteiro: string, data: string): Promise<void> {

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "ta.ess.2020.2@gmail.com",
      pass: "ess2020a"
    }
  });

  for (let i = 0; i < alunos.length; i++) {
    const aluno = alunos[i];
    const mailOptions = {
      from: `ta.ess.2020.2@gmail.com`,
      to: aluno.email,
      subject: "subject",
      text: `Atenção ${aluno.nome}! O roteiro  ${nomeRoteiro} deve ser entregue até o fim do dia:(${data})`,
      //html: "<b></b>"(html subrescreve o text, mas da pra usar pra fazer msg formatadas)
    };
    let info = await transporter.sendMail(mailOptions);
  }
}

function checkDate(dataRoteiro: string): boolean{
  let dataRoteiroDate: number = Date.parse(dataRoteiro);
  let dataAtual: number =  Date.now();
  if(dataRoteiroDate - dataAtual <= (86400000) && dataRoteiroDate - dataAtual > 0){
    console.log(true);
    return true;
  }
  console.log(false);
  return false;
}

cron.schedule("0 0 * * *", () => {
  console.log("teste");
  for (let i = 0; i < cadastroRoteiros.roteiros.length; i++) {
    const element = cadastroRoteiros.roteiros[i];
    if(checkDate(element.dataDeEntrega)){
      sendMailRoteiro(cadastroAlunos.alunos, element.nome, element.dataDeEntrega);
    }
  }
});

function closeServer(): void {
  server.close();
}

export { server, closeServer }