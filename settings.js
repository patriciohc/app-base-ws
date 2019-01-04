
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
  connectionString: 'postgres://odydbhciatemui:c33bda646cffadc59e13b84a64b8c731bbf08f3a2e18d54e0bf52173d0abe4f4@ec2-54-225-200-15.compute-1.amazonaws.com:5432/df5i3tva6iq78m'
  //connectionString: process.env.DATABASE_URL
}


const ONE_SIGNAL = {
  portal_client: {
    app_id: "d4f6ac11-64cc-451d-8471-e8552ef57f86",
    token: "ZWFmNTNmYjEtZDA0ZS00YTg3LWI4YmEtNWUwMzQ1NjUzOTRi"
  },
  app: {
    app_id: "57c22654-7696-44a9-8d2c-503590e2554f",
    token: "MjkyZDgxNDAtNTIwMS00MDY0LWE2MGEtOWY1ZTFiOGJjMTNh"
  },

  default: {
    app_id: "57c22654-7696-44a9-8d2c-503590e2554f",
    token: "MjkyZDgxNDAtNTIwMS00MDY0LWE2MGEtOWY1ZTFiOGJjMTNh"   
  }
}



module.exports = {
  SECRET_KEY,
  DATA_BASE,
  ONE_SIGNAL
}


