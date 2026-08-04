class User {
constructor({id, name, email, passwordHash,isAdmin=false,timezone='UTC',createdAt,updatedAt}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.isAdmin = isAdmin;
    this.timezone = timezone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
}
}
module.exports = User;