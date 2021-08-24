Feature: As a professor
    I want to post roteiros and alert my students about them

    Scenario: Registering new roteiro
        Given I am at the roteiros page
        When I fill and click to register a roteiro "Roteiro1" with limit date "2021-09-25"
        Then I can see the roteiro "Roteiro1" in the roteiros list

    Scenario: Trying to register a roteiro with same name
        Given I am at the roteiros page
        And I have the roteiro "Roteiro2" with limit date "2021-09-25" in the roteiros list
        When I fill and click to register a roteiro "Roteiro2" with limit date "2022-01-01"
        Then I can not see "Roteiro2" with limit date "2022-01-01" in the roteiros list
        And I receive an error message in regards to roteiro registration

    Scenario: Trying to register a roteiro with invalid date
        Given I am at the roteiros page
        When I fill and click to register a roteiro "RoteiroX" with limit date "2021-08-23"
        Then I can not see "RoteiroX" with limit date "2021-08-23" in the roteiros list
        And I receive an error message in regards to a invalid date roteiro registration

    Scenario: Warning about the limit date of a roteiro (email), service
        Given the roteiro "Roteiro3" with limit date "2021-09-01" is registered in the database
        When the warning email about the roteiro "Roteiro3" with limit date "2021-09-01" is requested
        Then the system stores "true" in the attribute enviado of the roteiro "Roteiro3"

    Scenario: Removing a roteiro
        Given I am at the roteiros page
        And I fill and click to register a roteiro "Roteiro4" with limit date "2021-09-08"
        When I click the button "Remover" refferent to the roteiro "Roteiro4"
        Then I can not see the roteiro "Roteiro4" in the roteiros list anymore

    Scenario: Removing a roteiro, service
        Given the roteiro "Roteiro5" with limit date "2021-12-01" is registered in the database
        When the removal of the roteiro "Roteiro5" is requested
        Then the roteiro "Roteiro5" is not in the database anymore
