Feature: Envio de email com resultado na disciplina (aprovado, reprovado, final, etc.)

Scenario: Aluno foi aprovado por média
Given: Estou na página de enviar notas para os alunos
And: eu preenchi a mensagem que vai ser enviada aos alunos
When: Eu seleciono a opção de enviar os resultados
Then: O sistema envia um email para todos os alunos da turma que foram aprovados por média

Scenario Aluno foi Reprovado
Given: Estou na página de enviar notas para os alunos
And: eu preenchi a mensagem que vai ser enviada aos alunos
When: Eu seleciono a opção de enviar os resultados
Then: O sistema envia um email para todos os alunos da turma que foram reprovados

Scenario Aluno precisa fazer prova final
Given: Estou na página de enviar notas para os alunos
And: eu preenchi a mensagem que vai ser enviada aos alunos
When: Eu seleciono a opção de enviar os resultados
Then: O sistema envia um email para todos os alunos da turma que devem fazer prova final da disciplina