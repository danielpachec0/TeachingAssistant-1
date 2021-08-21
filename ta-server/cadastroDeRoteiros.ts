import { Roteiro } from '../common/roteiro';

export class CadastroDeRoteiros {
    roteiros: Roteiro[] = [];

    cadastrar(roteiro: Roteiro): Roteiro {
        var result = null;
        if (this.cpfNaoCadastrado(roteiro.nome)) {
          result = new Roteiro();
          result.copyFrom(roteiro);
          this.roteiros.push(result);
        }
        return result;
    }

    cpfNaoCadastrado(nome: string): boolean {
        return !this.roteiros.find(a => a.nome == nome);
    }

    atualizar(roteiro: Roteiro): Roteiro {
        var result: Roteiro = this.roteiros.find(a => a.nome == roteiro.nome);
        if (result) result.copyFrom(roteiro);
        return result;
    }
   
    getRoteiros(): Roteiro[] {
        return this.roteiros;
    }
}