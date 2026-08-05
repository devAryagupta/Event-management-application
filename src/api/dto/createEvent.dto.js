function toCreateEventDto(body = {}) {
    return {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      description: body.description ?? null,
      location: body.location ?? null,
      timezone: typeof body.timezone === 'string' ? body.timezone : '',
      startTime: body.startTime,
      endTime: body.endTime,
      profileIds: Array.isArray(body.profileIds)
      ? [...new Set(body.profileIds.filter((id) => typeof id === 'string' && id))]
      : [],
    };
  }
  module.exports = { toCreateEventDto };