const Pool = require("pg").Pool;
const pool = new Pool({
  user: "hack",
  host: "localhost",
  database: "postgres",
  password: "hackunt",
  port: 5432,
});

const getUser = async (id) => {
  const user = await pool.query("select * from users where id = $1", [id]);
  return user.rows[0];
};

const getTransactionsForMonth = async (id, category) => {
  const transactions = await pool.query(
    `select * from transactions where card = $1 ${
      category ? "and category = $2" : ""
    } and created >= date_trunc('month', CURRENT_DATE)`,
    category ? [id, category] : [id],
  );

  return transactions.rows;
};

const getAggregatedTransactionsForMonth = async (id, category) => {
  const transactions = await pool.query(
    `select category, sum(amount) as amount from transactions where card = $1 ${
      category ? "and category = $2" : ""
    } and created >= date_trunc('month', CURRENT_DATE) and approved group by category`,
    category ? [id, category] : [id],
  );

  return transactions.rows;
};

const getLimitForCategory = async (id, category) => {
  const limit = await pool.query(
    "select category, amount from limits where card = $1 and category = $2",
    [id, category],
  );
  return limit.rows[0]?.amount;
};

module.exports = {
  pool,
  getUser,
  getTransactionsForMonth,
  getAggregatedTransactionsForMonth,
  getLimitForCategory,
};
