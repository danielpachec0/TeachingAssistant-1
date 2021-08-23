Feature: As a professor
    Eu desejo fazer envio de email(s) alertando fim do tempo de responder o roteiro

Scenario: Registrando novo roteiro 
    Given estou na pagina de roteiros
    When um roteiro é registrado com nome "Roteiro1" data limite dia "2021-08-23"
    Then eu consigo ver o roteiro "Roteiro1" com data limite "2021-08-23" na lista de roteiros

Scenario: Registrando roteiro com nome repetido
    Given estou na pagina de roteiros
    And eu consigo ver o roteiro "Roteiro1" com data limite "2021-08-23" na lista de roteiros
    When tento registrar o roteiro "Roteiro1" data limite dia "2022-01-01"
    Then não vejo "Roteiro1" com data de entrega "2022-01-01" na lista de roteiros
    And consigo ver uma mensagem de erro em registro de roteiro

Scenario: Email de aviso de fim de prazo para roteiro, serviço
    Given estou na pagina de roteiros
    And existe o roteiro "Roteiro2" com data limite "2021-09-01" na lista de roteiros
    When o envio de email for requisitado para o "Roteiro2" com data limite "2021-09-01"
    Then o "Roteiro2" ainda é armazenado na lista de roteiros
