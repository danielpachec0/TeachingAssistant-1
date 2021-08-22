Feature: Como um professor
    Desejo fazer envio de email(s) com o resultado na disciplina (aprovado, reprovado, final, etc.)

Scenario: Cadastrando notas de aluno
	Given eu posso ver o aluno "Charles Gabriel" com CPF "683" e email "cgcc@cin.ufpe.br" na lista de estudantes
    And eu estou na página de enviar notas para os alunos
    When eu associo a "Charles Gabriel" com CPF "683" as notas "8" e "7" respectivamente
    Then eu posso ver que as notas de "Charles Gabriel" com CPF "683" são "8" e "7" respectivamente
	
Scenario: Cadastrando notas de aluno, serviço
    Given Estou na página de enviar notas para os alunos
    When Eu recebo do campo de Requisitos associado ao aluno "Charles Gabriel", o valor "8"
    And Eu recebo do campo de Requisitos associado ao aluno "John", po valor "1"
    And Eu recebo do campo de Requisitos associado ao aluno "Henrique", o valor "3"
    And Eu recebo do campo de Gerência de Configuração associado ao aluno "Charles Gabriel", o valor "10"
    And Eu recebo do campo de Gerência de Configuração associado ao aluno "Jonh", o valor "3"
    And Eu recebo do campo de Gerência de Configuração associado ao aluno "Henrique", o valor "5"
    Then Associa-se as notas aos alunos respectivamente por meio de um json

Scenario: Cadastrando notas inadequadas para alunos
    Given Estou na página de enviar notas para os alunos
    When Eu clico no campo de Requisitos associado ao aluno "Mr T", preenchendo com "11"
    And Clico no campo de Gerência de Configuração associado ao aluno "Mr T", preenchendo com "-1"
    Then O sistema associa a nota "10" ao campo de Requisitos do aluno "Mr T"
    And O sistema associa a nota "0" ao campo de Gerência de Configuração do aluno "Mr T"

Scenario: Cadastrando notas inadequadas para alunos
    Given: Estou na página de enviar notas para os alunos
    When: Eu recebo do campo de Requisitos associado ao aluno "Mr T", o valor "11"
    And: Eu recebo do campo de Gerência de Configuração associado ao aluno "Mr T", o valor "-1"
    Then: Associa-se a nota "10" ao campo de Requisitos do aluno "Mr T"
    And: Associa-se a nota "0" ao campo de Gerência de Configuração do aluno "Mr T"

Scenario: Aluno foi aprovado por média
    Given: estou na página de enviar notas para os alunos
    When: Eu clico no botão de "Enviar Resultado" associado ao aluno "Charles Gabriel"
    Then: O sistema envia um email para o endereço associado a "Charles Gabriel", com a média "9" e
               uma mensagem de aprovação "Parabéns, você foi aprovado com média 9"

Scenario: Aluno foi aprovado por média, serviço
    Given: O sistema tem as notas "8" e "10" associadas a "Charles Gabriel", respectivamente
    When: Eu recebo o pedido de enviar resultado associado ao aluno "Charles Gabriel"
    Then: Envio um email para o endereço associado a "Charles Gabriel", com a média "9" e
               uma mensagem de aprovação "Parabéns, você foi aprovado com média 9"

Scenario: Aluno foi reprovado
    Given: Estou na página de enviar notas para os alunos
    When: Eu clico no botão de "Enviar Resultado" associado ao aluno "Jonh"
    Then: O sistema envia um email para o endereço associado a "Jonh", com a média "2" e
               uma mensagem de reprovação "Infelizmente sua média ficou abaixo de 3, você foi reprovado"

Scenario: Aluno foi reprovado, serviço
    Given: O sistema tem as notas "1" e "3" associadas a "Jonh", respectivamente
    When: Eu recebo o pedido de enviar resultado associado ao aluno "Jonh"
    Then: Envio um email para o endereço associado a "Jonh", com a média "2" e
               uma mensagem de reprovação "Infelizmente sua média ficou abaixo de 3, você foi reprovado"

Scenario: Aluno precisa fazer prova final
    Given: Estou na página de enviar notas para os alunos
    When: Eu clico no botão de "Enviar Resultado" associado ao aluno "Henrique"
    Then: O sistema envia um email para o endereço associado a "Henrique", com a média "4" e
               uma mensagem de reprovação "Infelizmente sua média ficou abaixo de 5, você está na final. Boa sorte."

Scenario: Aluno precisa fazer prova final, serviço
    Given: O sistema tem as notas "3" e "5" associadas a "Henrique", respectivamente
    When: Eu recebo o pedido de enviar resultado associado ao aluno "Henrique"
    Then: O sistema envia um email para o endereço associado a "Henrique", com a média "4" e
               uma mensagem de reprovação "Infelizmente sua média ficou abaixo de 5, você está na final. Boa sorte."

Scenario: Envio de média final para um email invalido
	Given Estou na página de enviar notas para os alunos
	And Eu posso ver o aluno "Charles" com email "batata.com"
	When Eu tento enviar o email de resultado para "Charles" com email "batata.com"
	Then Eu recebo uma mensagem de erro
	And Eu posso ver o aluno "Charles" com email "batata.com"

Scenario: Envio de média final para um email invalido, serviço
	Given O sistema possui o aluno "Charles" com email "batata.com"
	When O email de resultado é enviado para "Charles" com email "batata.com"
	Then O sistema recebe uma mensagem de erro
	And O sistema possui o aluno "Charles" com email "batata.com"