class AuthorizationError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.status = 401;
    this.name = "AuthorizationError";
  }
}

module.exports = AuthorizationError;
