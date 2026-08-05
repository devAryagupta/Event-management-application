function sendApiError(req, res, err) {
  const statusCode = err?.statusCode || 500;
  const clientMessage =
    statusCode >= 500
      ? 'Something went wrong. Please try again.'
      : err?.message || 'Request failed.';

  req.logMessage = err?.message || clientMessage;
  if (statusCode >= 500) {
    req.logError = err;
  }

  return res.status(statusCode).json({
    error: clientMessage,
    ...(err?.status ? { status: err.status } : {}),
    ...(err?.code ? { code: err.code } : {}),
  });
}

module.exports = sendApiError;