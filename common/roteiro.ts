

export class Roteiro{
    nome: string;
    dataDeEntrega: string;
    enviado: boolean;

    constructor() {
        this.clean();
    }

    clean(): void{
        this.nome = "";
        this.dataDeEntrega = "";
        this.enviado = false;
    }

    clone(): Roteiro{
        var roteiro: Roteiro = new Roteiro();
        roteiro.copyFrom(this);
        return roteiro;
    }

    copyFrom(from: Roteiro): void {
        this.nome = from.nome;
        this.dataDeEntrega = from.dataDeEntrega;
        this.enviado = from.enviado;
    }
}

