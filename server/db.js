const Pool = require("pg").Pool;
const pool = new Pool({
  user: "hack",
  host: "localhost",
  database: "postgres",
  password: "hackunt",
  port: 5432,
});

const getUser = async (id) => {
  const user = await pool.query('select * from users where id = $1', [id]);
  return user.rows[0];
}

module.exports = {
  pool,
  getUser,
}
