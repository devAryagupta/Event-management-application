class Event {
constructor({id, title, description, startTime, endTime, timezone, createdAt, updatedAt, organizerId,location}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    this.timezone = timezone;
    this.organizerId = organizerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.location = location;
}
}
module.exports = Event;