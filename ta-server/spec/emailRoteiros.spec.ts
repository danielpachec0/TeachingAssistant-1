import { CadastroDeRoteiros } from '../cadastroDeRoteiros';
import { Roteiro } from '../../common/roteiro';
import { Aluno } from '../../common/aluno';
import { EmailNotas } from '../emailNotas';
import { EmailRoteiros } from '../emailRoteiros';

describe("O emailNotas de emailNotas", () => {
    var emailRoteiros: EmailRoteiros;

    beforeEach(() => emailRoteiros = new EmailRoteiros())

    it("Recebe um aluno e um roteiro e cria um texto de email" ,() => {
        const aluno = new Aluno();
        aluno.nome = "Pedro";
        aluno.cpf = "3";
        aluno.email = "dap5@cin.ufpe.br";
        aluno.metas = new Map<string, string>();
        aluno.metas.set("nota1", "-10");
        aluno.metas.set("nota2", "sasd10");
        const roteiro = new Roteiro();
        roteiro.nome = "roteiro1";
        roteiro.dataDeEntrega = "10-10-2021";
        expect(emailRoteiros.createMail(roteiro, aluno)).toBe("Atenção Pedro! O roteiro  roteiro1 deve ser entregue até o fim do dia:(10-10-2021)");
    })
})
