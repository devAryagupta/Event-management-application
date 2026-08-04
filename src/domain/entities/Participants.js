class Participants {
constructor({id, eventId, userId, createdAt,role='attendee',during}) {
    this.id = id;
    this.eventId = eventId;
    this.userId = userId;
    this.createdAt = createdAt; 
    this.role = role;
    this.during = during;
}
}
module.exports = Participants;