const FRIENDLY_BY_STATUS = {
  400: 'Please check the form details and try again.',
  401: 'Your session expired. Please sign in again.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  409: 'One or more selected profiles are busy at this time. Please choose another slot.',
  500: 'Something went wrong on our side. Please try again.',
};

const LEGACY_MESSAGE_MAP = {
  'Not Available':
    'One or more selected profiles are busy at this time. Please choose another slot.',
  'User already in event': 'That profile is already part of this meeting.',
  'endTime must be after startTime': 'End time must be after start time.',
  'Only organizer can update this event':
    'Only the organizer can edit this meeting.',
  'Only the organizer can update this event':
    'Only the organizer can edit this meeting.',
  'Updated time conflicts with a participant availability':
    'The new time conflicts with another meeting for one or more participants. Please choose a different slot.',
};

function looksTechnical(message) {
  if (!message) return true;
  return /error:|exception|stack|ECONN|postgres|operator does not exist|violates/i.test(
    message
  );
}

export function toUserMessage(err, fallback = 'Something went wrong. Please try again.') {
  const raw = (err?.message || err?.data?.error || '').trim();
  const status = err?.status || err?.data?.statusCode;

  if (raw && LEGACY_MESSAGE_MAP[raw]) {
    return LEGACY_MESSAGE_MAP[raw];
  }

  // Prefer clear API business messages (already written for users).
  if (raw && !looksTechnical(raw) && raw.length <= 220) {
    return raw;
  }

  if (status && FRIENDLY_BY_STATUS[status]) {
    return FRIENDLY_BY_STATUS[status];
  }

  return fallback;
}