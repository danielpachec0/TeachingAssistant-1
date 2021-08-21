Feature: Como professor
    Eu desejo fazer envio de email(s) alertando fim do tempo de responder o roteiro

Scenario: Roteiro foi disponibilizado
    Given: Estou na página de estudantes
    And: O aluno “Charles Gabriel” faz parte da turma
    When: Um roteiro é criado com data limite de "23/08" de "10:00"
    Then: “Charles Gabriel” receberá um email sobre o roteiro no endereço associado a ele
    And: O email contém "23/08" como data e "10:00" como horário de entrega final

Scenario: Roteiro foi disponibilizado, serviços
    Given: O sistema tem acesso ao email do estudante "Charles Gabriel"
    When: Um novo roteiro com prazo "23/08" "10:00" é adicionado ao sistema
    Then: É enviado um email para “Charles Gabriel” no endereço "cgcc@cin.ufpe.br"
    And: O email contém "23/08" como data e "10:00" como horário de entrega final

Scenario: O prazo de entrega do roteiro está acabando
    Given: O roteiro disponibilizado tem como prazo dia "23/08" às "10:00"
    And: É dia "22/08"
    And: O aluno “Charles Gabriel” faz parte da turma
    Then: “Charles Gabriel” receberá um email sobre o roteiro 
    And: O email contém a data "23/08" às "10:00" como alerta de final do prazo

Scenario: O prazo de entrega do roteiro está acabando, serviços
    Given: O sistema tem acesso ao email do estudante "Charles Gabriel"
    And: O roteiro prazo "23/08" "10:00" existe no sistema
    When: É dia "22/08"
    Then: É enviado um email para “Charles Gabriel” no endereço "cgcc@cin.ufpe.br"
    And: O email contém "23/08" como data e "10:00" como horário de entrega final

Scenario: Prazo de entrega do roteiro se encerrou
    Given: O prazo de entrega do roteiro é dia "23/08"  às "10:00"
    And: É dia 24/08
    And: O aluno “Charles Gabriel” faz parte da turma “Informática Teórica”
    Then: “Charles Gabriel” receberá um email sobre final do prazo do roteiro
    And: O email informa sobre o prazo perdido avisando que já é dia "24/08"

Scenario: Prazo de entrega do roteiro se encerrou, serviços
    Given: O sistema tem acesso ao email do estudante "Charles Gabriel"
    And: O roteiro prazo "23/08" "10:00" existe no sistema
    When: É dia "24/08"
    Then: É enviado um email para “Charles Gabriel” no endereço "cgcc@cin.ufpe.br"
    And: O email informa sobre o prazo perdido avisando que já é dia "24/08"

	Scenario: Envio de nota de roteiro para um email invalido
	Given Eu estou na pagina de estudantes
	And Eu posso ver o aluno "Charles" com email "batata.com"
	When Eu tento enviar o email do resultado do roteiro "Requisitos" para "Charles" com email "batata.com"
	Then Eu recebo uma mensagem de erro
	And Eu posso ver o aluno "Charles" com email "batata.com"

Scenario: Envio de nota de roteiro para um email invalido, serviço
	Given O sistema possui o aluno "Charles" com email "batata.com"
	When O email de resultado do roteiro "Requisitos" é enviado para "Charles" com email "batata.com"
	Then O sistema recebe uma mensagem de erro
	And O sistema possui o aluno "Charles" com email "batata.com"
