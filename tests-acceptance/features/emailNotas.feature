Feature: Like a teacher
	I would like to send email(s) with the result in the course (approved, failed, final, etc.)

	Scenario: Student with filled grades
		Given I'm on the student's page
		And I can see the student "Charles" with CPF "683" and email "gasm@cin.ufpe.br" on the student list
		When I switch to goals page
		And I assign to the student with CPF "683" the grades "8" and "7" respectively
		And I click on the button "Enviar" referent to the CPF student "683"
		Then I can see the student with CPF "683" with grades "8" and "7" respectively
		And I see a message "Relatório enviado com sucesso!" on the screen
		And I see a message "Relatório enviado!" with a green background next to the student with CPF "683"

	Scenario: Aluno com notas preenchidas, service
		Given o sistema guarda o aluno "Gabriel" with CPF "777" and email "cgcc@cin.ufpe.br" and notas "5" and "6"
		When o sistema envia o email de relatorio para o aluno with CPF "777"
		Then o sistema armazena "true" na variavel "emailEnviado" do aluno with CPF "777"

	Scenario: Changing student grades, service
		Given o sistema guarda o aluno "Daniel" with CPF "999" and email "dap5@cin.ufpe.br" and notas "6" and "6"
		When o sistema envia o email de relatorio para o aluno with CPF "999"
		And the grades of the student "Daniel" with CPF "999" and email "dap5@cin.ufpe.br" are changed to "8" and "8"
		Then o sistema armazena "false" na variavel "emailEnviado" do aluno with CPF "999"

	Scenario: Aluno com notas parcialmente preenchidas
		Given I'm on the student's page
		And I can see the student "Tenorio" with CPF "222" and email "gasm@cin.ufpe.br" on the student list
		When I switch to goals page
		And I assign to the student with CPF "683" the grades "6" and "" respectively
		And I click on the button "Enviar" referent to the CPF student "222"
		Then I can see the student with CPF "222" with grades "6" and "" respectively
		And eu não vejo mensagem on the screen

	Scenario: Aluno com email invalido
		Given I'm on the student's page
		And I can see the student "Didier" with CPF "12345678900" and email "pedro.com" on the student list
		When I switch to goals page
		And I assign to the student with CPF "12345678900" the grades "5" and "1" respectively
		And I click on the button "Enviar" referent to the CPF student "12345678900"
		Then I can see the student with CPF "12345678900" with grades "5" and "1" respectively
		And I see a message "E-mail ou metas inválidos!" on the screen
		And I see a message "Relatório pendente!" com um fundo vermelho ao lado do aluno de CPF "12345678900"

	Scenario: Aluno com email invalido, service
		Given o sistema guarda o aluno "Gabriel" with CPF "778" and email "cgcc.br" and notas "5" and "6"
		When o sistema falha ao enviar email de relatorio para o aluno with CPF "778"
		Then o sistema armazena "false" na variavel "emailEnviado" do aluno with CPF "778"

	Scenario: Aluno com metas invalidas
		Given I'm on the student's page
		And I can see the student "Pedro" with CPF "05042316426" and email "ptl@cin.ufpe.br" on the student list
		When I switch to goals page
		And I assign to the student with CPF "05042316426" the grades "w" and "5" respectively
		And I click on the button "Enviar" referent to the CPF student "05042316426"
		Then I can see the student with CPF "05042316426" with grades "w" and "5" respectively
		And I see a message "E-mail ou metas inválidos!" on the screen

	Scenario: Aluno com metas invalidas, service
		Given o sistema guarda o aluno "Gabriel" with CPF "779" and email "cgcc@cin.ufpe.br" and notas "5" and "z"
		When o sistema falha ao enviar email de relatorio para o aluno with CPF "779"
		Then o sistema armazena "false" na variavel "emailEnviado" do aluno with CPF "779"
