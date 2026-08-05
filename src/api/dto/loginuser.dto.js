function toLoginUserDto(body = {}) {
    return {
      email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
      password: typeof body.password === 'string' ? body.password : '',
    };
  }
  
  module.exports = { toLoginUserDto };