function createAuthenticateMiddleware({ jwtService }) {
  return function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      req.logMessage = 'Missing or invalid Authorization header';
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = header.slice('Bearer '.length).trim();
    try {
      const payload = jwtService.verify(token);
      req.user = {
        id: payload.sub,
        email: payload.email,
        isAdmin: payload.isAdmin,
      };
      return next();
    } catch (err) {
      req.logMessage = 'Invalid or expired token';
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}
module.exports = createAuthenticateMiddleware;