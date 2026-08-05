function createAuthenticateMiddleware({ jwtService }) {
    return function authenticate(req, res, next) {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
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
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    };
  }
  module.exports = createAuthenticateMiddleware;