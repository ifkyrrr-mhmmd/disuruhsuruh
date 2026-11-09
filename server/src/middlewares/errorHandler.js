export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) console.error('[SERVER ERROR]', err);

  const message = statusCode >= 500 && !isDev
    ? 'Terjadi kesalahan internal pada server. Silakan coba lagi.'
    : err.message || 'Terjadi kesalahan internal pada server';

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(isDev && { stack: err.stack }),
  });
};

export default errorHandler;
