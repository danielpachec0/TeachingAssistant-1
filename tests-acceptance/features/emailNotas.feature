Feature: Como um professor
    Desejo fazer envio de email(s) com o resultado na disciplina (aprovado, reprovado, final, etc.)

Scenario: Aluno foi aprovado por média
    Given: Estou na página de enviar notas para os alunos
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