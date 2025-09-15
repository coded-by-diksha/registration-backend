const {Pool} = require('pg');

const pool=new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'registration',
    password: '2063',
    port: 5432, // default port for PostgreSQL
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

module.exports=pool;