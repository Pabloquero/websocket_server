module.exports = { apps : [{
    name      : 'Chat Server',
    script    : 'server.js',
    env_localdev : {
      PORT: 3000,
      DB_SCHEME: 'DB_SCHEME',
      DB_USER: 'DB_USER',
      DB_PASS: 'DB_PASS',
      DB_HOST: 'DB_HOST',
    },
    env_development : {
      PORT: 3000,
      DB_SCHEME: 'DB_SCHEME',
      DB_USER: 'DB_USER',
      DB_PASS: 'DB_PASS',
      DB_HOST: 'DB_HOST',
    },
    env_production  : {
      PORT: 3000,
      DB_SCHEME: 'DB_SCHEME',
      DB_USER: 'DB_USER',
      DB_PASS: 'DB_PASS',
      DB_HOST: 'DB_HOST',
    },
  }]};