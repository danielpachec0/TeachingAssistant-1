Feature: As a professor
    I want to post roteiros and alert my students about them

    Scenario: Registering new roteiro
        Given I am at the roteiros page
        When I register a roteiro "Roteiro1" with limit date "2021-08-23"
        Then I can see the roteiro "Roteiro1" with limit date "2021-08-23" in the roteiros list

    Scenario: Trying to register a roteiro with same name
        Given I am at the roteiros page
        And I have the roteiro "Roteiro2" with limit date "2021-08-24" in the roteiros list
        When I register a roteiro "Roteiro2" with limit date "2022-01-01"
        Then I can not see "Roteiro2" with limit date "2022-01-01" in the roteiros list
        And I receive an error message in regards to roteiro registration

    Scenario: Warning about the limit date of a roteiro (email), service
        Given I am at the roteiros page
        And I have the roteiro "Roteiro3" with limit date "2021-09-01" registered in the database
        When I request the warning email about the roteiro "Roteiro3" with limit date "2021-09-01"
        Then the roteiro "Roteiro3" is still in the roteiros database
