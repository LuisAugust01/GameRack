class User {
    constructor(id, username, password, isAdmin = false, email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
        this.email = email;
    }
}

module.exports = User;