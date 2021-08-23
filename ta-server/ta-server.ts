import express = require('express');
import bodyParser = require("body-parser");
import nodemailer = require("nodemailer")
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

taserver.post('/testeEmailRoteiro', function (req: express.Request, res: express.Response) {
  var roteiro: Roteiro = <Roteiro> req.body;
  try {
    sendMailRoteiro(cadastroAlunos.alunos, roteiro.nome, roteiro.dataDeEntrega);
    res.send({"success": "Os emails foram enviado com sucesso"})
  } catch (err) {
    console.log(err)
    res.send({"failure": "Não foi possivel enviar os emails"});
  }
})

//----------------------------------------
taserver.post("/sendnotas", function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body;
  var media: Number = calcular_media(aluno)
  var situacao: String = ""
  try {
    if(media >= 7) {
      situacao = "Aprovado por média"
    } else if (media >= 3) {
      situacao = "Final"
    } else {
      situacao = "Reprovado por média"
    }
    sendNotas(aluno, "[Média Final]", `Sua média final foi: ${media}\nSituação:${situacao}`)
    res.send({"success": "O relatório foi enviado com sucesso"});
  } catch (err) {
    console.log(err)
    res.send({"failure": "O relatório não pôde ser enviado"});
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

async function sendNotas(aluno: Aluno, subject: string,text: string): Promise<void> {

  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "ta.ess.2020.2@gmail.com",
      pass: "ess2020a"
    }
  });

  const mailOptions = {
    from: `ta.ess.2020.2@gmail.com`,
    to: aluno.email,
    subject: subject,
    text: text,
    //html: "<b></b>"(html subrescreve o text, mas da pra usar pra fazer msg formatadas)
  };

  let info = await transporter.sendMail(mailOptions);
}

//----------------------------------------------------

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
    return true;
  }
  return false;
}

cron.schedule("0 0 * * *", () => {
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
