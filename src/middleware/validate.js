export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({ message: 'Validation error', errors: result.error.flatten() });
    }
    // Only assign back for mutable sources; req.query is read-only
    if (source !== 'query') {
      req[source] = result.data;
    }
    // Optionally expose parsed data without mutating
    req.validated = req.validated || {};
    req.validated[source] = result.data;
    next();
  };