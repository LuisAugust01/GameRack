class Item {
    constructor(id, gameId, tipo, nome, qualidade, descricao, preco, contato) {
        this.id = id;
        this.gameId = gameId;
        this.tipo = tipo;
        this.nome = nome;
        this.qualidade = qualidade;
        this.descricao = descricao;
        this.preco = preco;
        this.contato = contato;
    }
}

module.exports = Item;
