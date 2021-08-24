import { Aluno } from '../common/aluno';
import { EmailSender } from './email-sender';



export class EmailNotas{
    emailSender = new EmailSender();
    createMail(aluno: Aluno): boolean{
        if(this.metasInvalidas(aluno)){
            return false
        }
        const media: Number = this.calcular_media(aluno);
        let situacao: string;
        if (media >= 7) {
            situacao = "Aprovado por média"
          } else if (media >= 3) {
            situacao = "Final"
          } else {
            situacao = "Reprovado por média"
          }
        const text: string = `Sua média final foi: ${media}\nSituação:${situacao}`;
        return this.emailSender.sendEMail(aluno,"[Média Final]", text);
    }

    private calcular_media(aluno: Aluno): Number {
        // var mean = 0
        // var length = Object.keys(aluno.metas).length
        // for (let key in aluno.metas) {
        //   let value = +aluno.metas[key];
        //   mean += value
        // }
        // return mean/length
        return 10
    }

    private metasInvalidas(aluno: Aluno): boolean {
        for (let key in aluno.metas){
            if (isNaN(aluno.metas[key]) || aluno.metas[key] < 0 || aluno.metas[key] > 10){
                return true;
            }
        }
        return false;
    }
}