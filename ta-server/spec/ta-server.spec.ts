import request = require("request-promise");
import { closeServer } from '../ta-server';

var base_url = "http://localhost:3000/";

describe("O servidor", () => {
  var server:any;

  beforeAll(() => {server = require('../ta-server')});

  afterAll(() => {server.closeServer()});

  it("inicialmente retorna uma lista de alunos vazia", () => {
    return request.get(base_url + "alunos")
            .then(body => 
               expect(body).toBe("[]")
             )
            .catch(e => 
               expect(e).toEqual(null)
             );
  })

  it("inicialmente retorna uma lista de roteiros vazia", () => {
   return request.get(base_url + "roteiro")
           .then(body => 
              expect(body).toBe("[]")
            )
           .catch(e => 
              expect(e).toEqual(null)
            );
 })

   it("Adciona um roteiro remove o mesmo roteiro depois", () => {
      var options:any = {method: 'POST', uri: (base_url + "roteiro"), body:{nome: "roteiro0", dataDeEntrega: "10-10-2021"}, json: true};
      return request(options)
         .then(body => {
            expect(body).toEqual({"success": "O roteiro foi cadastrado com sucesso"});
               var options2:any = {method: 'DELETE', uri: (base_url + "roteiro"), body:{nome: "roteiro0"}, json: true};
               return request(options2).then( body => {
                  expect(body).toEqual({ "success": 'O roteiro foi removido com sucesso' });
                  return request.get(base_url + "alunos")
                  .then(body =>  
                     expect(body).toBe("[]")
                  )
                  .catch(e => 
                     expect(e).toEqual(null)
                  );
               });
         }    
      ).catch(e =>
         expect(e).toEqual(null)
      )
   })

  it("só cadastra alunos", () => {
    var options:any = {method: 'POST', uri: (base_url + "aluno"), body:{name: "Mari", cpf: "962"}, json: true};
    return request(options)
             .then(body =>
                expect(body).toEqual({"success": "O aluno foi cadastrado com sucesso"})
             ).catch(e =>
                expect(e).toEqual(null)
             )
  });

  it("só cadastra roteiros", () => {
   var options:any = {method: 'POST', uri: (base_url + "roteiro"), body:{nome: "roteiro1", dataDeEntrega: "10-10-2021"}, json: true};
   return request(options)
            .then(body =>
               expect(body).toEqual({"success": "O roteiro foi cadastrado com sucesso"})
            ).catch(e =>
               expect(e).toEqual(null)
            )
 });


  it("não cadastra alunos com CPF duplicado", () => {
    var aluno1 = {"json":{"nome": "Mari", "cpf" : "965", "email":""}};
    var aluno2 = {"json":{"nome": "Pedro", "cpf" : "965", "email":""}};
    var resposta1 = '{"nome":"Mari","cpf":"965","email":"","metas":{}}';
    var resposta2 = '{"nome":"Pedro","cpf":"965","email":"","metas":{}}';

    return request.post(base_url + "aluno", aluno1)
             .then(body => {
                expect(body).toEqual({success: "O aluno foi cadastrado com sucesso"});
                return request.post(base_url + "aluno", aluno2)
                         .then(body => {
                            expect(body).toEqual({failure: "O aluno não pode ser cadastrado"});
                            return request.get(base_url + "alunos")
                                     .then(body => {
                                        expect(body).toContain(resposta1);
                                        expect(body).not.toContain(resposta2);
                                      });
                          });
              })
              .catch(err => {
                 expect(err).toEqual(null)
              });
 })

 it("não cadastra roteiros com nomes duplicados", () => {
   var roteiro1 = {"json":{"nome": "roteiro11", "dataDeEntrega" : "10-10-2021"}};
   var roteiro2 = {"json":{"nome": "roteiro11", "dataDeEntrega" : "11-18-2021"}};
   var resposta3 = '{"nome":"roteiro11","dataDeEntrega":"10-10-2021"}';
   var resposta4 = '{"nome":"roteiro11", "dataDeEntrega":"11-18-2021"';

   return request.post(base_url + "roteiro", roteiro1)
            .then(body => {
               expect(body).toEqual({"success": "O roteiro foi cadastrado com sucesso"});
               return request.post(base_url + "roteiro", roteiro2)
                        .then(body => {
                           expect(body).toEqual({"failure": "O roteiro não pode ser cadastrado"});
                           return request.get(base_url + "roteiro")
                                    .then(body => {
                                       expect(body).toContain(resposta3);
                                       expect(body).not.toContain(resposta4);
                                     });
                         });
             })
             .catch(err => {
                expect(err).toEqual(null)
             });
   })

})