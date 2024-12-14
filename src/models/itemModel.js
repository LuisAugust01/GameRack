class Item {
    constructor(id, gameId, type, name, quality, description, price, contact) {
        this.id = id;
        this.gameId = gameId;
        this.type = type;
        this.name = name;
        this.quality = quality;
        this.description = description;
        this.price = price;
        this.contact = contact;
    }
}

module.exports = Item;