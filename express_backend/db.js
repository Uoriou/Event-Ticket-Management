const { Pool } = require('pg');

const pool = new Pool({
  user: 'mario',
  password: 'mariopassword',
  host: 'db', 
  port: 5432, // default Postgres port
  database: 'etms'
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};