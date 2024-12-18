class User {
    constructor(id, username, email, password, isAdmin = false) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
    }
}

module.exports = User;