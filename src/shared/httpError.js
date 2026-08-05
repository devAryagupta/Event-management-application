function createHttpError(message, statusCode = 500, extras = {}) {
  const err = new Error(message);
  err.statusCode = statusCode;
  Object.assign(err, extras);
  return err;
}
// when  try to call an attendee thats already on the other event the conflict error is thrown
function conflictError(message, extras = {}) {
  return createHttpError(message, 409, {
    code: 'CONFLICT',
    ...extras,
  });
}

function isAvailabilityConflict(error) {
  // Postgres exclusion_violation
  return error?.code === '23P01';
}

function isUniqueViolation(error) {
  return error?.code === '23505';
}

module.exports = {
  createHttpError,
  conflictError,
  isAvailabilityConflict,
  isUniqueViolation,
};