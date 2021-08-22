import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;
import request = require("request-promise");

var base_url = "http://localhost:3000/";

let sameCPF = ((elem, cpf) => elem.element(by.name('cpflist')).getText().then(text => text === cpf));
let sameName = ((elem, name) => elem.element(by.name('nomelist')).getText().then(text => text === name));

let pAND = ((p,q) => p.then(a => q.then(b => a && b)))

async function criarAluno(name, cpf) {
    await $("input[name='namebox']").sendKeys(<string> name);
    await $("input[name='cpfbox']").sendKeys(<string> cpf);
    await element(by.buttonText('Adicionar')).click();
}
async function updateAluno(name, cpf, notaRequisito, notaConfig) {
	var allalunos : ElementArrayFinder = element.all(by.name('metaslist'));
    var samecpfsandname = allalunos.filter(elem => pAND(sameCPF(elem,cpf),sameName(elem,name)));
    await $("samecpfsandname[0][name='requisitosBox']").sendKeys(<string> notaRequisito);
	await $("samecpfsandname[0][name='gerDeConfiguracaoBox']").sendKeys(<string> notaConfig);
}

async function assertTamanhoEqual(set,n) {
    await set.then(elems => expect(Promise.resolve(elems.length)).to.eventually.equal(n));
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
	//nao vejo o CPF "683" na lista de estudantes
    Given(/^nao vejo o CPF "(\d*)" na lista de estudantes$/, async (cpf) => {
        await assertElementsWithSameCPF(0,cpf);
    });
	//tento cadastrar o aluno "Charles" com CPF "683"
    When(/^tento cadastrar o aluno "([^"]*)" com CPF "(\d*)"$/, async (name, cpf) => {
        await criarAluno(name,cpf);
    });
	//eu posso ver "Charles" com "683" na lista de estudantes
    Then(/^I can see "([^"]*)" with CPF "(\d*)" in the students list$/, async (name, cpf) => {
        await assertElementsWithSameCPFAndName(1,cpf,name);
    });

    Given(/^I can see a student with CPF "(\d*)" in the students list$/, async (cpf) => {
        await criarAluno("Clarissa",cpf);
        await assertElementsWithSameCPF(1,cpf); 
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
