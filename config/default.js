const ENV = process.env
module.exports = {
  port: ENV.PORT ? Number(ENV.PORT) : 8000,
}
