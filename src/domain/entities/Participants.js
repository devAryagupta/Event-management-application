class Participants {
constructor({id, eventId, userId, createdAt,updatedAt,role='attendee',during}) {
    this.id = id;
    this.eventId = eventId;
    this.userId = userId;
    this.createdAt = createdAt; 
    this.role = role;
    this.during = during;
    this.updatedAt = updatedAt;
}
}
module.exports = Participants;