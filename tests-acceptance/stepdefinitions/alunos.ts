import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;
import request = require("request-promise");

var base_url = "http://localhost:3000/";

let sameCPF = ((elem, cpf) => elem.element(by.name('cpflist')).getText().then(text => text === cpf));
let sameName = ((elem, name) => elem.element(by.name('nomelist')).getText().then(text => text === name));
let sameDate = ((elem, date) => elem.element(by.name('datelist')).getText().then(text => text === date));

let pAND = ((p,q) => p.then(a => q.then(b => a && b)))

async function criarAluno(name, cpf, email) {
    await $("input[name='namebox']").sendKeys(<string> name);
    await $("input[name='cpfbox']").sendKeys(<string> cpf);
	await $("input[name='emailbox']").sendKeys(<string> email);
    await element(by.buttonText('Adicionar')).click();
}

async function criarRoteiro(nome, data) {
    await $("input[name='namebox']").sendKeys(<string> nome);
    await $("input[name='datebox']").sendKeys(<string> data);
    await element(by.buttonText('Adicionar')).click();
}

async function updateAluno(name, cpf, notaRequisito, notaConfig) {
	var allalunos : ElementArrayFinder = element.all(by.name('metaslist'));
    var samecpfsandname = allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name)));
    await $("samecpfsandname[0][name='requisitosBox']").sendKeys(<string> notaRequisito);
	await $("samecpfsandname[0][name='gerDeConfiguracaoBox']").sendKeys(<string> notaConfig);
}

async function assertNotas(name, cpf, notaRequisito, notaConfig) {
	var allalunos : ElementArrayFinder = element.all(by.name('metaslist'));
    var samecpfsandname = allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name)));
    await $("samecpfsandname[0][name='requisitosBox']").gettext() == notaRequisito;
	await $("samecpfsandname[0][name='gerDeConfiguracaoBox']").gettext() == notaConfig;
}

async function assertTamanhoEqual(set,n) {
    await set.then(elems => expect(Promise.resolve(elems.length)).to.eventually.equal(n));
}

async function assertElementsWithSameCPFAndName(n,cpf,name) { 
    var allalunos : ElementArrayFinder = element.all(by.name('alunolist'));
    var samecpfsandname = allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name)));
    await assertTamanhoEqual(samecpfsandname,n);
}

async function assertRoteiroWithSameName(name) { 
    var allroteiros : ElementArrayFinder = element.all(by.name('roteirolist'));
    var samename= allroteiros.filter(elem => sameName(elem,name));
    await assertTamanhoEqual(samename,1);
}

async function assertElementsWithSameCPF(n,cpf) {
    var allalunos : ElementArrayFinder = element.all(by.name('alunolist'));
    var samecpfs = allalunos.filter(elem => sameCPF(elem,cpf));
    await assertTamanhoEqual(samecpfs,n); 
}

async function assertElementsWithSameDateAndName(n,date,name) {
    var allroteiros : ElementArrayFinder = element.all(by.name('roteirolist'));
    var samedateandname = allroteiros.filter(elem => pAND(sameDate(elem,date),sameName(elem,name)));
    await assertTamanhoEqual(samedateandname,n);
}

defineSupportCode(function ({ Given
                                , When
                                , Then
}) {
	Given(/^eu estou na pagina do estudante$/, async () => {
        await browser.get("http://localhost:4200");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='alunos']").click();
    })
	
	Given(/^estou na página de enviar notas para os alunos$/, async () => {
        await browser.get("http://localhost:4200");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='metas']").click();
    })

    Given(/^I am at the roteiros page$/, async () => {
        await browser.get("http://localhost:4200");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='roteiros']").click();
    })

	//eu associo a "Charles Gabriel" com CPF "683" as notas "8" e "7" respectivamente
	When(/^eu associo a "([^"]*)" com CPF "(\d*)" as notas "(\d*)" e "(\d*)" respectivamente$/, async (name, cpf,notaReq,notaConf) => {
        await assertElementsWithSameCPFAndName(1,cpf,name);
		await updateAluno(name,cpf,notaReq,notaConf);
    });

    When(/^I request the warning email about the roteiro "([^"]*)" with limit date "([^"]*)"$/, async (nameRoteiro, dataLimite) => {
        let roteiro = {"nome":nameRoteiro,"dataDeEntrega":dataLimite};
        var options:any = {method: 'POST', uri: (base_url + "testeEmailRoteiro"), body:roteiro, json: true};
        await request(options)
              .then(body => 
                   expect(JSON.stringify(body)).to.equal(
                       '{"success":"Os emails foram enviado com sucesso"}'));
    });

    Then(/^I receive an error message in regards to roteiro registration$/, async () => {
        var allmsgs : ElementArrayFinder = element.all(by.name('msgroteiroexistente'));
        await assertTamanhoEqual(allmsgs,1);
    });

    When(/^I register a roteiro "([^"]*)" with limit date "([^"]*)"$/, async (nomeRoteiro, dataLimite) => {
        await $("input[name='namebox']").sendKeys(<string> nomeRoteiro);
        await $("input[name='datebox']").sendKeys(<string> dataLimite);
        await element(by.buttonText('Adicionar')).click();
    });

	//eu posso ver que as notas de "Charles Gabriel" com CPF "683" são "8" e "7" respectivamente
    Then(/^eu posso ver que as notas de "([^"]*)" with CPF "(\d*)" são "(\d*)" e "(\d*)" respectivamente$/, async (name,cpf,notaReq,notaConf) => {
        await assertElementsWithSameCPFAndName(1,cpf,name);
		await assertNotas(name,cpf,notaReq,notaConf);
    });

    Given(/^eu consigo ver o estudante "([^"]*)" com CPF "(\d*)" e email "([^"]*)" na lista de estudante$/, async (name,cpf,email) => {
        await criarAluno(name,cpf,email);
        await assertElementsWithSameCPF(1,cpf); 
    });

    Given(/^existe o roteiro "([^"]*)" com data limite "([^"]*)" na lista de roteiros$/, async (nomeRoteiro, dataLimite) => {
        await criarRoteiro(nomeRoteiro, dataLimite);
        await assertRoteiroWithSameName(nomeRoteiro);
    });

    Given(/^I have the roteiro "([^"]*)" with limit date "([^"]*)" in the roteiros list$/, async (nomeRoteiro, dataLimite) => {
        await criarRoteiro(nomeRoteiro, dataLimite);
        await assertElementsWithSameDateAndName(1,dataLimite,nomeRoteiro);
    });

    Then(/^I can see the roteiro "([^"]*)" with limit date "([^"]*)" in the roteiros list$/, async (nomeRoteiro, dataLimite) => {
        await assertElementsWithSameDateAndName(1,dataLimite,nomeRoteiro);
    });

    Then(/^the roteiro "([^"]*)" is still in the roteiros database$/, async (nomeRoteiro) => {
        await request.get(base_url + "roteiro")
                .then(body => 
                   expect(body.includes(`"nome":"${nomeRoteiro}"`)).to.equal(true));
    });

    Then(/^I cannot see "([^\"]*)" with CPF "(\d*)" in the students list$/, async (name, cpf) => {
        await assertElementsWithSameCPFAndName(0,cpf,name);
    });

    Then(/^I can see an error message$/, async () => {
        var allmsgs : ElementArrayFinder = element.all(by.name('msgcpfexistente'));
        await assertTamanhoEqual(allmsgs,1);
    });

    Given(/^the system has no student with CPF "(\d*)"$/, async (cpf) => {
       await request.get(base_url + "alunos")
                .then(body => 
                   expect(body.includes(`"cpf":"${cpf}"`)).to.equal(false));
    });

    Then(/^I can not see "([^\"]*)" with limit date "([^\"]*)" in the roteiros list$/, async (nomeRoteiro, dataLimite) => {
        await assertElementsWithSameDateAndName(0,nomeRoteiro,dataLimite);
    });

    When(/^I register the student "([^\"]*)" with CPF "(\d*)"$/, async (name, cpf) => {
        let aluno = {"nome": name, "cpf" : cpf, "email":""};
        var options:any = {method: 'POST', uri: (base_url + "aluno"), body:aluno, json: true};
        await request(options)
              .then(body => 
                   expect(JSON.stringify(body)).to.equal(
                       '{"success":"O aluno foi cadastrado com sucesso"}'));
    });

    Given(/^I have the roteiro "([^\"]*)" with limit date "([^\"]*)" registered in the database$/, async (nomeRoteiro, dataLimite) => {
        let aluno = {"nome": nomeRoteiro, "dataDeEntrega" : dataLimite};
        var options:any = {method: 'POST', uri: (base_url + "roteiro"), body:aluno, json: true};
        await request(options)
              .then(body => 
                   expect(JSON.stringify(body)).to.equal(
                       '{"success":"O roteiro foi cadastrado com sucesso"}'));
    });

    Then(/^the system now stores "([^\"]*)" with CPF "(\d*)"$/, async (name, cpf) => {
        let resposta = `{"nome":"${name}","cpf":"${cpf}","email":"","metas":{}`;
        await request.get(base_url + "alunos")
                     .then(body => expect(body.includes(resposta)).to.equal(true));
    });

})
