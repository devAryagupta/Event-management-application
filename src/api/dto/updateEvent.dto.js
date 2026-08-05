function toUpdateEventDto(body = {}) {
    return {
      title: body.title,
      description: body.description,
      location: body.location,
      timezone: body.timezone,
      startTime: body.startTime,
      endTime: body.endTime,
    };
  }
  module.exports = { toUpdateEventDto };