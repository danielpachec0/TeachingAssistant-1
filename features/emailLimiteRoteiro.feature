Feature: Envio de email alertando fim do tempo de responder o roteiro 

Scenario roteiro foi disponibilizado
Given: O roteiro acabou de ser disponibilizado para a turma “Informática Teórica” 
And: O aluno “Charles Gabriel” faz parte da turma “Informática Teórica”
Then: “Charles Gabriel” receberá um email sobre o roteiro 
And: O email contém informações sobre a data de entrega do roteiro.

Scenario um dia antes do prazo do roteiro
Given: O roteiro já foi disponibilizado para a turma “Informática Teórica” e os alunos têm 24 horas para responder
And: O aluno “Charles Gabriel” faz parte da turma “Informática Teórica”
And: “Charles Gabriel” ainda não concluiu o roteiro
Then: “Charles Gabriel” receberá um email sobre o roteiro 
And: O email contém informações relembrando “Charles Gabriel” da data de entrega.

Scenario prazo do roteiro perdido
Given: O prazo do roteiro lançado na turma de “Informática Teórica” se expirou 
And: O aluno “Charles Gabriel” faz parte da turma “Informática Teórica”
And: “Charles Gabriel” não concluiu o roteiro
Then: “Charles Gabriel” receberá um email sobre o roteiro 
And: O email informa sobre o prazo perdido.
