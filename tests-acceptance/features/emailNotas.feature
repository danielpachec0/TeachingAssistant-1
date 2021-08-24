Feature: Como um professor
    Desejo fazer envio de email(s) com o resultado na disciplina (aprovado, reprovado, final, etc.)

Scenario: Aluno com notas preenchidas
	Given eu estou na pagina do aluno
	And eu posso ver o aluno "Charles" com CPF "683" e email "gasm@cin.ufpe.br" na lista de estudantes
	And eu estou na pagina de metas
	When eu atribuo ao aluno com CPF "683" as notas "8" e "7" respectivamente
	And eu clico no botão "Enviar" referente ao aluno de CPF "683"
	Then eu posso ver o aluno com CPF "683" com notas "8" e "7" respectivamente
	And eu vejo a mensagem "Relatório enviado com sucesso!" na tela
	And eu vejo a mensagem "Relatório enviado!" com um fundo verde ao lado do aluno de CPF "683"

Scenario: Aluno com notas preenchidas, serviço
	Given o sistema guarda o aluno "Gabriel" com CPF "777" e email "cgcc@cin.ufpe.br" e notas "5" e "6"
	When o sistema envia o email de relatorio para o aluno com CPF "777"
	Then o sistema armazena "true" na variavel "emailEnviado" do aluno com CPF "777"

Scenario: Aluno com notas parcialmente preenchidas
	Given eu estou na pagina do aluno
	And eu posso ver o aluno "Tenorio" com CPF "222" e email "gasm@cin.ufpe.br" na lista de estudantes
	And eu estou na pagina de metas
	When eu atribuo ao aluno com CPF "683" as notas "6" e "" respectivamente
	And eu clico no botão "Enviar" referente ao aluno de CPF "222"
	Then eu posso ver o aluno com CPF "222" com notas "6" e "" respectivamente
	And eu não vejo mensagem na tela

Scenario: Aluno com email invalido
	Given eu estou na pagina do aluno
	And eu posso ver o aluno "Didier" com CPF "12345678900" e email "pedro.com" na lista de estudantes
	And eu estou na pagina de metas
	When eu atribuo ao aluno com CPF "12345678900" as notas "5" e "1" respectivamente
	And eu clico no botão "Enviar" referente ao aluno de CPF "12345678900"
	Then eu posso ver o aluno com CPF "12345678900" com notas "5" e "1" respectivamente
	And eu vejo a mensagem "E-mail ou metas inválidos!" na tela
	And eu vejo a mensagem "Relatório pendente!" com um fundo vermelho ao lado do aluno de CPF "12345678900"

Scenario: Aluno com email invalido, serviço
	Given o sistema guarda o aluno "Gabriel" com CPF "778" e email "cgcc.br" e notas "5" e "6"
	Then o sistema falha ao enviar email de relatorio para o aluno com CPF "778"

Scenario: Aluno com metas inválidas
	Given eu estou na pagina do aluno
	And eu posso ver o aluno "Pedro" com CPF "05042316426" e email "ptl@cin.ufpe.br" na lista de estudantes
	And eu estou na pagina de metas
	When eu atribuo ao aluno com CPF "05042316426" as notas "w" e "5" respectivamente
	And eu clico no botão "Enviar" referente ao aluno de CPF "05042316426"
	Then eu posso ver o aluno com CPF "05042316426" com notas "w" e "5" respectivamente
	And eu vejo a mensagem "E-mail ou metas inválidos!" na tela

Scenario: Aluno com metas inválidas, serviço
	Given o sistema guarda o aluno "Gabriel" com CPF "779" e email "cgcc@cin.ufpe.br" e notas "5" e "z"
	Then o sistema falha ao enviar email de relatorio para o aluno com CPF "779"
