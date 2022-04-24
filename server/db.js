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
    `select internal, external, sum(a.amount) as amount, l.amount as limit
    from transactions a
      inner join categories b on a.category = b.internal
      left join limits l on a.category = l.category
    where a.card = $1 ${category ? "and internal = $2" : ""}
      and created >= date_trunc('month', CURRENT_DATE)
      and approved
    group by internal, external, l.amount`,
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

const getTransactionsInCategory = (card, category) =>
  pool
    .query("select * from transactions where card = $1 and category = $2", [
      card,
      category,
    ])
    .then((r) => r.rows);

const getCardIdForUser = (userId) =>
  pool
    .query("select card from cards where cardholder = $1", [userId])
    .then((r) => r.rows[0].card);

const getCategories = () =>
  pool.query("select * from categories").then((d) => d.rows);

module.exports = {
  pool,
  getUser,
  getTransactionsForMonth,
  getAggregatedTransactionsForMonth,
  getLimitForCategory,
  getCategories,
  getTransactionsInCategory,
  getCardIdForUser,
};
