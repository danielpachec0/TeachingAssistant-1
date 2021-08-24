Feature: Like a teacher
	I would like to send email(s) with the result in the course (approved, failed, final, etc.)

	Scenario: Student with filled grades
		Given I am at the student's page
		And I can see the student "Charles" with CPF "683" and email "gasm@cin.ufpe.br" on the student list
		When I switch to goals page
		And I assign to the student with CPF "683" the grades "8" and "7" respectively
		And I click on the button "Enviar" referent to the CPF student "683"
		Then I can see the student with CPF "683" with grades "8" and "7" respectively
		And I see a message "Relatório enviado com sucesso!" on the screen
		And I see a message "Relatório enviado!" with a green background next to the student with CPF "683"

	Scenario: Student with completed grades, service
		Given The system keeps the student  "Gabriel" with CPF "777" and email "cgcc@cin.ufpe.br" and grades "5" and "6"
		When The system sends the report email to the student with CPF "777"
		Then The system stores "true" in the attribute relatorioEnviado of the student with CPF "777"

	Scenario: Changing student grades, service
		Given The system keeps the student  "Daniel" with CPF "999" and email "dap5@cin.ufpe.br" and grades "6" and "6"
		When The system sends the report email to the student with CPF "999"
		And The grades of the student "Daniel" with CPF "999" and email "dap5@cin.ufpe.br" are changed to "8" and "8"
		Then The system stores "false" in the attribute relatorioEnviado of the student with CPF "999"

	Scenario: Student with partially filled grades
		Given I am at the student's page
		And I can see the student "Tenorio" with CPF "222" and email "gasm@cin.ufpe.br" on the student list
		When I switch to goals page
		And I assign to the student with CPF "683" the grades "6" and "" respectively
		And I click on the button "Enviar" referent to the CPF student "222"
		Then I can see the student with CPF "222" with grades "6" and "" respectively
		And I don't see message on the screen

	Scenario: Student with invalid email
		Given I am at the student's page
		And I can see the student "Didier" with CPF "12345678900" and email "pedro.com" on the student list
		When I switch to goals page
		And I assign to the student with CPF "12345678900" the grades "5" and "1" respectively
		And I click on the button "Enviar" referent to the CPF student "12345678900"
		Then I can see the student with CPF "12345678900" with grades "5" and "1" respectively
		And I see a message "E-mail inválido!" on the screen
		And I see a message "Relatório pendente!" with a red background next to the student with CPF "12345678900"

	Scenario: Student with invalid email, service
		Given The system keeps the student  "Gabriel" with CPF "778" and email "cgcc.br" and grades "5" and "6"
		When System fails to send report email to student with CPF "778"
		Then The system stores "false" in the attribute relatorioEnviado of the student with CPF "778"

	Scenario: Student with Invalid Goals
		Given I am at the student's page
		And I can see the student "Pedro" with CPF "05042316426" and email "ptl@cin.ufpe.br" on the student list
		When I switch to goals page
		And I assign to the student with CPF "05042316426" the grades "w" and "5" respectively
		And I click on the button "Enviar" referent to the CPF student "05042316426"
		Then I can see the student with CPF "05042316426" with grades "w" and "5" respectively
		And I see a message "Metas inválidas!" on the screen

	Scenario: Student with Invalid Goals, service
		Given The system keeps the student  "Gabriel" with CPF "779" and email "cgcc@cin.ufpe.br" and grades "5" and "z"
		When System fails to send report email to student with CPF "779"
		Then The system stores "false" in the attribute relatorioEnviado of the student with CPF "779"
