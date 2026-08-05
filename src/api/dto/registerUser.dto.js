function toRegisterUserDto(body = {}) {
    return {
      name: typeof body.name === 'string' ? body.name.trim() : '',
      email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
      password: typeof body.password === 'string' ? body.password : '',
      timezone: typeof body.timezone === 'string' ? body.timezone : 'UTC',
    };
  }
  
  module.exports = { toRegisterUserDto };