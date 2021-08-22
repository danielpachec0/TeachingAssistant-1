Feature: Como um professor
    Desejo fazer envio de email(s) com o resultado na disciplina (aprovado, reprovado, final, etc.)

Scenario: Cadastro de aluno
	Given eu estou na pagina do aluno
	And eu nao posso ver um aluno com CPF "683" na lista de estudantes
	When eu tento cadastrar o aluno "Charles" com CPF "683" e email "gasm@cin.ufpe.br"
	Then eu posso ver o aluno "Charles" com CPF "683" e email "gasm@cin.ufpe.br" na lista de estudantes

Scenario: Aluno com notas preenchidas
	Given eu estou na pagina de metas
	And eu posso ver o aluno "Charles" com CPF "683" e email "gasm@cin.ufpe.br" na lista de metas
	When eu atribuo ao aluno com CPF "683" as notas "8" e "7" respectivamente
	Then eu posso ver o aluno com CPF "683" com notas "8" e "7" respectivamente
	And eu envio um email de resultado para "gasm@cin.ufpe.br"

