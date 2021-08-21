import express = require('express');
import bodyParser = require("body-parser");
import nodemailer = require("nodemailer")

import {Aluno} from '../common/aluno';
import {CadastroDeAlunos} from './cadastrodealunos';

var taserver = express();

var cadastro: CadastroDeAlunos = new CadastroDeAlunos();

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
  var aluno: Aluno = <Aluno> req.body;
  try {
    sendNotas(aluno, "teste", "teste")
  } catch (err) {
    console.log(err)
  }
  res.send();
})

var server = taserver.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

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

function closeServer(): void {
  server.close();
}

export { server, closeServer }
