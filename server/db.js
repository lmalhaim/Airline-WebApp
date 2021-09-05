
const Pool = require('pg').Pool;



const pool = new Pool({
  host: "db-postgresql-lmalhaim-do-user-9778591-0.b.db.ondigitalocean.com", 
  user: "doadmin", 
  password: "iub92a9v6ogvef0t", 
  port: 25060, 
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;


