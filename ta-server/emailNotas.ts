import { Aluno } from '../common/aluno';
import { EmailSender } from './email-sender';



export class EmailNotas{
    emailSender = new EmailSender();
    createMail(aluno: Aluno): string{
        if(this.metasInvalidas(aluno)){
            return "Metas invalidas"
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
        return `Sua média final foi: ${media}\nSituação:${situacao}`;
        //const text: string = `Sua média final foi: ${media}\nSituação:${situacao}`;
        //return this.emailSender.sendEMail(aluno,"[Média Final]", text);
    }

    private calcular_media(aluno: Aluno): Number {
        var mean = 0
        var length = Object.keys(aluno.metas).length
        for (let key in aluno.metas) {
          let value = +aluno.metas[key];
          mean += value
        }
        return mean/length
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
