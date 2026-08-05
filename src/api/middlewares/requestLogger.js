const logger = require('../../shared/logger');

function requestLogger(req, res, next) {
  // Keep health checks quiet in local/demo logs.
  if (req.path === '/health') {
    return next();
  }

  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    const userId = req.user?.id || 'anonymous';
    const summary = `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms user=${userId}`;

    if (res.statusCode >= 500) {
      logger.error(summary, req.logError || req.logMessage);
      return;
    }

    if (res.statusCode >= 400) {
      logger.warn(summary, req.logMessage || undefined);
      return;
    }

    logger.info(summary);
  });

  next();
}

module.exports = requestLogger;