class User {
    constructor(id, username, password, isAdmin = false) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
    }
}

module.exports = User;