import { Roteiro } from '../common/roteiro';

export class CadastroDeRoteiros {
    roteiros: Roteiro[] = [];

    cadastrar(roteiro: Roteiro): Roteiro {
        var result = null;
        if (this.roteiroNaoCadastrado(roteiro.nome)) {
          result = new Roteiro();
          result.copyFrom(roteiro);
          this.roteiros.push(result);
        }
        return result;
    }

    roteiroNaoCadastrado(nome: string): boolean {
        return !this.roteiros.find(r => r.nome == nome);
    }

    atualizar(roteiro: Roteiro): Roteiro {
        var result: Roteiro = this.roteiros.find(r => r.nome == roteiro.nome);
        if (result) result.copyFrom(roteiro);
        return result;
    }
   
    getRoteiros(): Roteiro[] {
        return this.roteiros;
    }
}
