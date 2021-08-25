import { Aluno } from '../common/aluno';
import { Roteiro } from '../common/roteiro';
import { EmailSender } from './email-sender';

export class EmailRoteiros{
    emailSender = new EmailSender;

    createMail(roteiro: Roteiro, aluno: Aluno){
        return `Atenção ${aluno.nome}! O roteiro  ${roteiro.nome} deve ser entregue até o fim do dia:(${roteiro.dataDeEntrega})`;
        //const text: string = `Atenção ${aluno.nome}! O roteiro  ${roteiro.nome} deve ser entregue até o fim do dia:(${roteiro.dataDeEntrega})`;
        //this.emailSender.sendEMail(aluno, "Roteiro", text);
    }
}