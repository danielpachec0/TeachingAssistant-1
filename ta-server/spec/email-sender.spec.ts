
import { Aluno } from '../../common/aluno';
import {EmailSender} from "../email-sender";

describe("O cadastro de alunos", () => {
    var emailSender: EmailSender;

    beforeEach(() => (emailSender = new EmailSender()));

    it('envia e-mails corretamente', function () {
        const aluno = new Aluno();
        aluno.nome = "Pedro";
        aluno.cpf = "05042316426";
        aluno.email = "ptl@cin.ufpe.br"
        expect(emailSender.sendEMail(aluno, "Assunto", "Oi!")).toBe(true)
    });

    it('não envia para e-mails inválidos', function () {
        const aluno = new Aluno();
        aluno.nome = "Pedro";
        aluno.cpf = "05042316426";
        aluno.email = "pedro.com";
        expect(emailSender.sendEMail(aluno, "Assunto", "Oi!")).toBe(false)
    });
})


