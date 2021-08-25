import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;
import request = require("request-promise");

var base_url = "http://localhost:3000/";

let sameName = ((elem, name) => elem.element(by.name('nomelist')).getText().then(text => text === name));
let sameDate = ((elem, date) => elem.element(by.name('datelist')).getText().then(text => text === date));

let pAND = ((p,q) => p.then(a => q.then(b => a && b)))

async function assertBotaoPressionado(nomebotao, nomeRoteiro) {
    var allroteiros : ElementArrayFinder = element.all(by.name('roteirolist'));
    var roteiro = allroteiros.filter(elem => sameName(elem,nomeRoteiro)).get(0);
    await roteiro.all(by.buttonText(nomebotao)).click();
}

async function criarRoteiro(nome, data) {
    await $("input[name='namebox']").sendKeys(<string> nome);
    await $("input[name='datebox']").sendKeys(<string> data);
    await element(by.buttonText('Adicionar')).click();
}

async function assertTamanhoEqual(set,n) {
    await set.then(elems => expect(Promise.resolve(elems.length)).to.eventually.equal(n));
}

async function assertRoteiroWithSameName(n,name) { 
    var allroteiros : ElementArrayFinder = element.all(by.name('roteirolist'));
    var samename= allroteiros.filter(elem => sameName(elem,name));
    await assertTamanhoEqual(samename,n);
}

async function assertRoteiroWithSameDateAndName(n,date,name) {
    var allroteiros : ElementArrayFinder = element.all(by.name('roteirolist'));
    var samedateandname = allroteiros.filter(elem => pAND(sameDate(elem,date),sameName(elem,name)));
    await assertTamanhoEqual(samedateandname,n);
}

defineSupportCode(function ({ Given
                                , When
                                , Then
}) {

    Given(/^I am at the roteiros page$/, async () => {
        await browser.get("http://localhost:4200");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='roteiros']").click();
    })

    When(/^the warning email about the roteiro "([^"]*)" with limit date "([^"]*)" is requested$/, async (nameRoteiro, dataLimite) => {
        let roteiro = {"nome":nameRoteiro,"dataDeEntrega":dataLimite};
        var options:any = {method: 'POST', uri: (base_url + "testeEmailRoteiro"), body:roteiro, json: true};
        await request(options)
              .then(body => 
                   expect(JSON.stringify(body)).to.equal(
                       '{"success":"Os emails foram enviados com sucesso"}'));
    });

    When(/^the removal of the roteiro "([^"]*)" is requested$/, async (nameRoteiro) => {
        let roteiro = {"nome":nameRoteiro,"dataDeEntrega":null};
        var options:any = {method: 'DELETE', uri: (base_url + "roteiro"), body:roteiro, json: true};
        await request(options)
              .then(body => 
                   expect(JSON.stringify(body)).to.equal(
                       '{"success":"O roteiro foi removido com sucesso"}'));
    });

    Then(/^I receive an error message in regards to roteiro registration$/, async () => {
        var allmsgs : ElementArrayFinder = element.all(by.id('duplicateMessage'));
        await assertTamanhoEqual(allmsgs,1);
    });

    Then(/^I receive an error message in regards to a invalid date roteiro registration$/, async () => {
        var allmsgs : ElementArrayFinder = element.all(by.id('sendMessage'));
        await assertTamanhoEqual(allmsgs,1);
    });

    When(/^I fill and click to register a roteiro "([^"]*)" with limit date "([^"]*)"$/, async (nomeRoteiro, dataLimite) => {
        await $("input[name='namebox']").sendKeys(<string> nomeRoteiro);
        await $("input[name='datebox']").sendKeys(<string> dataLimite);
        await element(by.buttonText('Adicionar')).click();
    });

    When(/^I click the button "([^"]*)" refferent to the roteiro "([^"]*)"$/, async (button, nomeRoteiro) => {
        await assertBotaoPressionado(button, nomeRoteiro);
    });

    Given(/^I have the roteiro "([^"]*)" with limit date "([^"]*)" in the roteiros list$/, async (nomeRoteiro, dataLimite) => {
        await criarRoteiro(nomeRoteiro, dataLimite);
        await assertRoteiroWithSameDateAndName(1,dataLimite,nomeRoteiro);
    });

    Then(/^I can see the roteiro "([^"]*)" in the roteiros list$/, async (nomeRoteiro) => {
        await assertRoteiroWithSameName(1,nomeRoteiro);
    });

    Then(/^I can not see the roteiro "([^"]*)" in the roteiros list anymore$/, async (nomeRoteiro) => {
        await assertRoteiroWithSameName(0,nomeRoteiro);
    });

    Then(/^the roteiro "([^"]*)" is not in the database anymore$/, async (nomeRoteiro) => {
        await request.get(base_url + "roteiro")
                .then(body => 
                   expect(body.includes(`"nome":"${nomeRoteiro}"`)).to.equal(false));
    });

    Then(/^the system stores "([^\"]*)" in the attribute enviado of the roteiro "([^\"]*)"$/, async (bool, nomeRoteiro) => {
        const response = await request.get(base_url + 'roteiro', {json: true});
        expect(response.some((roteiro) => roteiro.nome == nomeRoteiro && roteiro.enviado.toString() == bool)).to.equal(true);
    })

    Then(/^I can not see "([^\"]*)" with limit date "([^\"]*)" in the roteiros list$/, async (nomeRoteiro, dataLimite) => {
        await assertRoteiroWithSameDateAndName(0,nomeRoteiro,dataLimite);
    });

    Given(/^the roteiro "([^\"]*)" with limit date "([^\"]*)" is registered in the database$/, async (nomeRoteiro, dataLimite) => {
        let aluno = {"nome": nomeRoteiro, "dataDeEntrega" : dataLimite};
        var options:any = {method: 'POST', uri: (base_url + "roteiro"), body:aluno, json: true};
        await request(options)
              .then(body => 
                   expect(JSON.stringify(body)).to.equal(
                       '{"success":"O roteiro foi cadastrado com sucesso"}'));
    });

})
