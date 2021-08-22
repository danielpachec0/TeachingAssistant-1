import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';

let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;
import request = require("request-promise");

var base_url = "http://localhost:3000/";

let sameCPF = ((elem, cpf) => elem.element(by.name('cpflist')).getText().then(text => text === cpf));
let sameName = ((elem, name) => elem.element(by.name('nomelist')).getText().then(text => text === name));
let sameEmail = ((elem, email) => elem.element(by.name('emaillist')).getText().then(text => text === email));

let pAND = ((p,q) => p.then(a => q.then(b => a && b)))

async function criarAluno(name, cpf, email) {
    await $("input[name='namebox']").sendKeys(<string> name);
    await $("input[name='cpfbox']").sendKeys(<string> cpf);
	await $("input[name='emailbox']").sendKeys(<string> email);
    await element(by.buttonText('Adicionar')).click();
}

async function assertTamanhoEqual(set,n) {
    await set.then(elems => expect(Promise.resolve(elems.length)).to.eventually.equal(n));
}

async function assertElementsWithSameCPFAndNameAndEmail(n,cpf,name,email) { 
    var allalunos : ElementArrayFinder = element.all(by.name('alunolist'));
    var samecpfsandname = allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name)));
	var samecpfsandnameandemail = samecpfsandname.filter(elem => sameEmail(elem,email));
    await assertTamanhoEqual(samecpfsandnameandemail,n);
}
async function assertElementsWithSameCPFAndNameAndEmailMETAS(n,cpf,name,email) { 
    var allalunos : ElementArrayFinder = element.all(by.name('metaslist'));
    var samecpfsandname = allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name)));
	var samecpfsandnameandemail = samecpfsandname.filter(elem => sameEmail(elem,email));
    await assertTamanhoEqual(samecpfsandnameandemail,n);
}

async function assertElementsWithSameCPFAndName(n,cpf,name) { 
    var allalunos : ElementArrayFinder = element.all(by.name('alunolist'));
    var samecpfsandname = allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name)));
    await assertTamanhoEqual(samecpfsandname,n);
}

async function assertElementsWithSameCPF(n,cpf) {
    var allalunos : ElementArrayFinder = element.all(by.name('alunolist'));
    var samecpfs = allalunos.filter(elem => sameCPF(elem,cpf));
    await assertTamanhoEqual(samecpfs,n); 
}
async function assertElementsWithSameCPFMETAS(n,cpf) {
    var allalunos : ElementArrayFinder = element.all(by.name('metaslist'));
    var samecpfs = allalunos.filter(elem => sameCPF(elem,cpf));
    await assertTamanhoEqual(samecpfs,n); 
}

async function updateAluno(cpf, notaRequisito, notaConfig) {
	var allalunos : ElementArrayFinder = element.all(by.name('metaslist'));
    var aluno = allalunos.filter(elem => sameCPF(elem,cpf)).get(0);
	var req = aluno.all(by.name('requisitosBox'));
	var conf = aluno.all(by.name('gerDeConfiguracaoBox'));
	req.clear();
	conf.clear();
	await req.sendKeys(<string> notaRequisito);
	await conf.sendKeys(<string> notaConfig);
	await req.sendKeys(<string> "");
}

async function assertNotas(cpf, notaRequisito, notaConfig) {
	var allalunos : ElementArrayFinder = element.all(by.name('metaslist'));
    var aluno = allalunos.filter(elem => sameCPF(elem,cpf)).get(0);
	var req = aluno.all(by.name('requisitosBox'));
	var conf = aluno.all(by.name('gerDeConfiguracaoBox'));
    await req.getText() == notaRequisito;
	await conf.getText() == notaConfig;
}
async function assertEnviarEmail(email) {
	var allalunos : ElementArrayFinder = element.all(by.name('metaslist'));
    var aluno = allalunos.filter(elem => sameEmail(elem,email)).get(0);
    await aluno.all(by.buttonText('Enviar')).click();
}
defineSupportCode(function ({ Given, When, Then }) {

    Given(/^eu estou na pagina do aluno$/, async () => {
        await browser.get("http://localhost:4200/");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='alunos']").click();
    })
	Given(/^eu estou na pagina de metas$/, async () => {
        await browser.get("http://localhost:4200/");
        await expect(browser.getTitle()).to.eventually.equal('TaGui');
        await $("a[name='metas']").click();
    })

    Given(/^eu nao posso ver um aluno com CPF "(\d*)" na lista de estudantes$/, async (cpf) => {
        await assertElementsWithSameCPF(0,cpf);
    });

    When(/^eu tento cadastrar o aluno "([^\"]*)" com CPF "(\d*)" e email "([^\"]*)"$/, async (name, cpf,email) => {
        await criarAluno(name,cpf,email);
    });

    Then(/^eu posso ver o aluno "([^\"]*)" com CPF "(\d*)" e email "([^\"]*)" na lista de estudantes$/, async (name, cpf,email) => {
        await assertElementsWithSameCPFAndNameAndEmail(1,cpf,name,email);
    });
	//eu posso ver o aluno "Charles" com CPF "683" e email "cgcc@cin.ufpe.br" na lista de metas
	Given(/^eu posso ver o aluno "([^\"]*)" com CPF "(\d*)" e email "([^\"]*)" na lista de metas$/, async (name, cpf, email) => {
        await assertElementsWithSameCPFAndNameAndEmailMETAS(1,cpf,name,email);
    })
	//eu posso ver o aluno com CPF "683" com notas "8" e "7" respectivamente
	Then(/^eu posso ver o aluno com CPF "(\d*)" com notas "(\d*)" e "(\d*)" respectivamente$/, async (cpf, notaReq,notaConf) => {
        await assertElementsWithSameCPFMETAS(1,cpf);
		await assertNotas(cpf,notaReq,notaConf);
    });

	Then(/^eu envio um email de resultado para "([^\"]*)"$/, async (email) => {
		await assertEnviarEmail(email);
    });

	//eu atribuo ao aluno "Charles" com CPF "683" as notas "8" e "7" respectivamente
	When(/^eu atribuo ao aluno com CPF "(\d*)" as notas "(\d*)" e "(\d*)" respectivamente$/, async (cpf,notaReq,notaConf) => {
        await updateAluno(cpf,notaReq,notaConf);
    });


    Given(/^the system has no student with CPF "(\d*)"$/, async (cpf) => {
       await request.get(base_url + "alunos")
                .then(body => 
                   expect(body.includes(`"cpf":"${cpf}"`)).to.equal(false));
    });

    When(/^I register the student "([^\"]*)" with CPF "(\d*)"$/, async (name, cpf) => {
        let aluno = {"nome": name, "cpf" : cpf, "email":""};
        var options:any = {method: 'POST', uri: (base_url + "aluno"), body:aluno, json: true};
        await request(options)
              .then(body => 
                   expect(JSON.stringify(body)).to.equal(
                       '{"success":"O aluno foi cadastrado com sucesso"}'));
    });

    Then(/^the system now stores "([^\"]*)" with CPF "(\d*)"$/, async (name, cpf) => {
        let resposta = `{"nome":"${name}","cpf":"${cpf}","email":"","metas":{}`;
        await request.get(base_url + "alunos")
                     .then(body => expect(body.includes(resposta)).to.equal(true));
    });

})