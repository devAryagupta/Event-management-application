class Participants {
  constructor({
    id,
    eventId,
    userId,
    createdAt,
    role = 'attendee',
    during,
    duringStart,
    duringEnd,
  }) {
    this.id = id;
    this.eventId = eventId;
    this.userId = userId;
    this.createdAt = createdAt;
    this.role = role;
    this.during = during;
    this.duringStart = duringStart;
    this.duringEnd = duringEnd;
  }
}
module.exports = Participants;
