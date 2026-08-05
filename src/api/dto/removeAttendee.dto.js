function toRemoveAttendeeDto(body = {}) {
  return {
    userId: body.userId,
  };
}
module.exports = { toRemoveAttendeeDto };
