class Audit {
constructor({id, eventId, changedBy, changedType, previousValue=null, newValue, createdAt,actorTimezone}) {
    this.id = id;
    this.eventId = eventId;
    this.changedBy = changedBy;
    this.changedType = changedType;
    this.previousValue = previousValue;
    this.newValue = newValue;
    this.createdAt = createdAt;
    this.actorTimezone = actorTimezone;
}
}
module.exports = Audit;