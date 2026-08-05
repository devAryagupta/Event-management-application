function stamp() {
  return new Date().toISOString();
}

function formatMeta(meta) {
  if (meta == null) return '';
  if (meta instanceof Error) {
    return meta.stack || meta.message;
  }
  if (typeof meta === 'string') return meta;
  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
}

function write(level, message, meta) {
  const line = `[${stamp()}] ${level.toUpperCase()} ${message}`;
  const details = formatMeta(meta);
  if (level === 'error') {
    if (details) console.error(line, '\n', details);
    else console.error(line);
    return;
  }
  if (level === 'warn') {
    if (details) console.warn(line, details);
    else console.warn(line);
    return;
  }
  if (details) console.log(line, details);
  else console.log(line);
}

const logger = {
  info(message, meta) {
    write('info', message, meta);
  },
  warn(message, meta) {
    write('warn', message, meta);
  },
  error(message, meta) {
    write('error', message, meta);
  },
};
module.exports = logger;