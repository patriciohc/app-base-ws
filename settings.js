
const SECRET_KEY = "secrete_key";

const DATA_BASE = {
  engine          : 'postgresql'//'mysql',
  // host            : 'us-cdbr-iron-east-05.cleardb.net',
  // user            : 'b93a567617aa59',
  // password        : '619b8316',
  // database        : 'heroku_e41bcc31c05226c'
}

// const DATE_BASE = {
//   engine          : 'postgresql',
//   host            : 'ec2-54-225-200-15.compute-1.amazonaws.com',
//   user            : 'odydbhciatemui',
//   password        : 'c33bda646cffadc59e13b84a64b8c731bbf08f3a2e18d54e0bf52173d0abe4f4',
//   database        : 'df5i3tva6iq78m',
//   port            : 5432,
// }

module.exports = {
  SECRET_KEY,
  DATA_BASE
}


