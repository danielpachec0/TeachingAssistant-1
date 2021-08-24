import { CadastroDeRoteiros } from '../cadastroDeRoteiros';
import { Roteiro } from '../../common/roteiro';
import { Aluno } from '../../common/aluno';
import { EmailNotas } from '../emailNotas';

describe("O emailNotas de emailNotas", () => {
    var emailNotas: EmailNotas;

    beforeEach(() => emailNotas = new EmailNotas())

    it("Recebe um aluno com nota < 3 e cria um mensagem de email para enviar para ele" ,() => {
        const aluno = new Aluno();
        aluno.nome = "Pedro";
        aluno.cpf = "1";
        aluno.email = "dap5@cin.ufpe.br";
        //aluno.metas = new Map<string, string>();
        aluno.metas["nota1"] = "1";
        aluno.metas["nota2"] = "3";
        expect(emailNotas.createMail(aluno)).toBe("Sua média final foi: 2\nSituação:Reprovado por média");
    })
    
    it("Recebe um aluno com nota >= 3 e < 7  e cria um mensagem de email para enviar para ele" ,() => {
        const aluno = new Aluno();
        aluno.nome = "Pedro";
        aluno.cpf = "2";
        aluno.email = "dap5@cin.ufpe.br";
        aluno.metas = new Map<string, string>();
        aluno.metas["nota1"] = "4";
        aluno.metas["nota2"] = "6";
        expect(emailNotas.createMail(aluno)).toBe("Sua média final foi: 5\nSituação:Final");
    })
    
    it("Recebe um aluno com nota >= 7e cria um mensagem de email para enviar para ele" ,() => {
        const aluno = new Aluno();
        aluno.nome = "Pedro";
        aluno.cpf = "3";
        aluno.email = "dap5@cin.ufpe.br";
        //aluno.metas = new Map<string, string>();
        aluno.metas["nota1"] = "10";
        aluno.metas["nota2"] = "10";
    expect(emailNotas.createMail(aluno)).toBe("Sua média final foi: 10\nSituação:Aprovado por média");
    })

    it("Recebe um aluno com notas em um formato invalido" ,() => {
        const aluno = new Aluno();
        aluno.nome = "Pedro";
        aluno.cpf = "3";
        aluno.email = "dap5@cin.ufpe.br";
        aluno.metas = new Map<string, string>();
        aluno.metas["nota1"] = "-11";
        aluno.metas["nota2"] = "3312";
        aluno.metas["nota2"] = "3312AAS";
        expect(emailNotas.createMail(aluno)).toBe("Metas invalidas");
    })
})
