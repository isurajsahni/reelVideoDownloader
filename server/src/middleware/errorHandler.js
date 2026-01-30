/**
 * Global error handler. Sends JSON errors and logs in development.
 */
export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  if (process.env.NODE_ENV !== 'test') {
    console.error('[Error]', status, message, err.stack);
  }
  res.status(status).json({
    success: false,
    error: message,
  });
}
