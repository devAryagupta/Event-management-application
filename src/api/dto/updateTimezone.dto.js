function toUpdateTimezoneDto(body = {}) {
    return {
      timezone: typeof body.timezone === 'string' ? body.timezone.trim() : '',
    };
  }
  module.exports = { toUpdateTimezoneDto };