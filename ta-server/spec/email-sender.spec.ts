
import { Aluno } from '../../common/aluno';
import {EMailSender} from "../email-sender";

describe("O cadastro de alunos", () => {
    var emailSender: EMailSender;

    beforeEach(() => (emailSender = new EMailSender()));

    it('envia e-mails corretamente', function () {
        const aluno = new Aluno();
        aluno.nome = "Pedro";
        aluno.cpf = "05042316426";
        aluno.email = "ptl@cin.ufpe.br"

        !expect(emailSender.sendEMail(aluno, "Assunto", "Oi!")).toBeNull()
    });

    it('não envia para e-mails inválidos', function () {
        const aluno = new Aluno();
        aluno.nome = "Pedro";
        aluno.cpf = "05042316426";
        aluno.email = "pedro.com"

        !expect(emailSender.sendEMail(aluno, "Assunto", "Oi!")).toBeNull()
    });

})


