const LEVELS = Object.freeze({
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
});

const normalizeError = (error) =>
  error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : error;
class LoggerConsoleService {
  constructor(context = "certifications") {
    this.context = context;
  }

  write(level, message, metadata = {}) {
    const method = console[level] ?? console.log;
    const entry = Object.freeze({
      timestamp: new Date().toISOString(),
      context: this.context,
      level,
      message,
      metadata: normalizeError(metadata),
    });
    method(`[${entry.context}] ${entry.message}`, entry);
    return entry;
  }
  debug(message, metadata) {
    return this.write(LEVELS.DEBUG, message, metadata);
  }
  info(message, metadata) {
    return this.write(LEVELS.INFO, message, metadata);
  }
  warn(message, metadata) {
    return this.write(LEVELS.WARN, message, metadata);
  }
  error(message, error) {
    return this.write(LEVELS.ERROR, message, error);
  }
}

export { LEVELS, LoggerConsoleService };
export default new LoggerConsoleService();
