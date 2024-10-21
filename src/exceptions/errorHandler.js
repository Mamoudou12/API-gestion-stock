const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'An error occurred on the server.' });
};

export default errorHandler;
