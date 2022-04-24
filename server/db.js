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
    `select internal, external, sum(amount) as amount from transactions a
    inner join categories b on a.category = b.internal where card = $1 ${
      category ? "and internal = $2" : ""
    } and created >= date_trunc('month', CURRENT_DATE) and approved
    group by internal, external`,
    category ? [id, category] : [id],
  );

  return transactions.rows;
};

const getLimitForCategory = async (id, category) => {
  const limit = await pool.query(
    "select category, amount from limits where card = $1 and category = $2",
    [id, category],
  );
  return limit.rows[0]?.amount ?? 999999;
};

const getCategories = () =>
  pool.query("select * from categories").then((d) => d.rows);

module.exports = {
  pool,
  getUser,
  getTransactionsForMonth,
  getAggregatedTransactionsForMonth,
  getLimitForCategory,
  getCategories,
};
