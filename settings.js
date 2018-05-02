
const SECRET_KEY = "secrete_key";

// const DATA_BASE = {
//   engine: 'mysql',
//   host: 'us-cdbr-iron-east-05.cleardb.net',
//   user: 'b93a567617aa59',
//   password: '619b8316',
//   database: 'heroku_e41bcc31c05226c'
// }

const DATA_BASE = {
  engine: 'postgresql',
  connectionString: process.env.DATABASE_URL
}

module.exports = {
  SECRET_KEY,
  DATA_BASE
}


