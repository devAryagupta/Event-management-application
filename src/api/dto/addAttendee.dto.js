function toAddAttendeeDto(body = {}) {
    return {
      userId: body.userId,
      role: body.role || 'attendee',
    };
  }
  module.exports = { toAddAttendeeDto };