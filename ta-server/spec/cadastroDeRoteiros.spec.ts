import { CadastroDeRoteiros } from '../cadastroDeRoteiros';
import { Roteiro } from '../../common/roteiro';

describe("O cadastroRoteiros de roteiros", () => {
  var cadastroRoteiros: CadastroDeRoteiros;

  function cadastrarRoteiro(nome:string, data:string) {
    var roteiro: Roteiro = new Roteiro();
    roteiro.nome = nome;
    roteiro.dataDeEntrega = data;
    cadastroRoteiros.cadastrar(roteiro);
  }

  function expectSoUmRoteiro() {
    expect(cadastroRoteiros.getRoteiros().length).toBe(1);
    var roteiro = cadastroRoteiros.getRoteiros()[0];
    return roteiro;
  }

  beforeEach(() => cadastroRoteiros = new CadastroDeRoteiros())

  it("é inicialmente vazio", () => {
    expect(cadastroRoteiros.getRoteiros().length).toBe(0);
  })

  it("cadastra roteiros corretamente", () => {
    cadastrarRoteiro("roteiro","1");

    var roteiro = expectSoUmRoteiro();
    expect(roteiro.nome).toBe("roteiro");
    expect(roteiro.dataDeEntrega).toBe("1");
  })

  it("não aceita roteiros com CPF duplicado", () => {
    cadastrarRoteiro("roteiro","1");
    cadastrarRoteiro("roteiro","2");

    var roteiro = expectSoUmRoteiro();
    expect(roteiro.dataDeEntrega).toBe("1");
  })

})


