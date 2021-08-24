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

    remover(nome: string): boolean {
        let index = -1;
        for (const r of this.roteiros){
            if (r.nome === nome) {
                index = this.roteiros.indexOf(r);
            }
        }
        if (index > -1){
            this.roteiros.splice(index, 1)
            return true;
        } else {
            return false;
        }

    }
   
    getRoteiros(): Roteiro[] {
        return this.roteiros;
    }
}
