Feature: Como um professor
    Desejo fazer envio de email(s) com o resultado na disciplina (aprovado, reprovado, final, etc.)

Scenario: Aluno com notas preenchidas
	Given eu estou na pagina de metas
	And eu posso ver o aluno "Charles" com CPF "683" e email "gasm@cin.ufpe.br" na lista de metas
	When eu atribuo ao aluno com CPF "683" as notas "8" e "7" respectivamente
	And eu clico no botão "Enviar" referente ao aluno de CPF "683"
	Then eu posso ver o aluno com CPF "683" com notas "8" e "7" respectivamente
	And eu vejo a mensagem "Relatório enviado com sucesso!" na tela

Scenario: Aluno com notas parcialmente preenchidas
	Given eu estou na pagina de metas
	And eu posso ver o aluno "Charles" com CPF "683" e email "gasm@cin.ufpe.br" na lista de metas
	When eu atribuo ao aluno com CPF "683" as notas "6" e "" respectivamente
	And eu clico no botão "Enviar" referente ao aluno de CPF "683"
	Then eu posso ver o aluno com CPF "683" com notas "6" e "" respectivamente
	And eu não vejo mensagem na tela

Scenario: Aluno com email invalido
	Given eu estou na pagina de metas
	And eu posso ver o aluno "Didier" com CPF "12345678900" e email "pedro.com" na lista de metas
	When eu atribuo ao aluno com CPF "12345678900" as notas "5" e "1" respectivamente
	And eu clico no botão "Enviar" referente ao aluno de CPF "12345678900"
	Then eu posso ver o aluno com CPF "12345678900" com notas "5" e "1" respectivamente
	And eu vejo a mensagem "E-mail ou metas inválidos!" na tela

Scenario: Aluno com metas inválidas
	Given eu estou na pagina de metas
	And eu posso ver o aluno "Pedro" com CPF "05042316426" e email "ptl@cin.ufpe.br" na lista de metas
	When eu atribuo ao aluno com CPF "05042316426" as notas "w" e "5" respectivamente
	And eu clico no botão "Enviar" referente ao aluno de CPF "05042316426"
	Then eu posso ver o aluno com CPF "05042316426" com notas "w" e "5" respectivamente
	And eu vejo a mensagem "E-mail ou metas inválidos!" na tela
