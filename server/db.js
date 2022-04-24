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
  const transactions = await pool
    .query(
      `select internal, external, sum(a.amount) as amount, l.amount as limit
    from transactions a
      inner join categories b on a.category = b.internal
      left join limits l on a.category = l.category
    where a.card = $1 ${category ? "and internal = $2" : ""}
      and created >= date_trunc('month', CURRENT_DATE)
      and approved
    group by internal, external, l.amount order by external`,
      category ? [id, category] : [id],
    )
    .then((r) => r.rows);

  const limits = await pool
    .query(
      `select internal, external, amount as limit
    from limits l
      inner join categories c on l.category = c.internal
    where l.card = $1
    group by internal, external, amount`,
      [id],
    )
    .then((r) => r.rows);

  limits
    .filter(
      (l) => transactions.findIndex((t) => t.internal === l.internal) === -1,
    )
    .forEach((limit) => {
      transactions.push({
        internal: limit.internal,
        external: limit.external,
        amount: null,
        limit: limit.limit,
      });
    });

  return transactions;
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

const createLimit = async (cardId, category, amount) => {
  const foundLimit = await pool
    .query("select * from limits where card = $1 and category = $2", [
      cardId,
      category,
    ])
    .then((r) => r.rows);
  if (foundLimit.length > 0) {
    return await pool
      .query(
        "update limits set amount = $1 where id = $2 returning id, card, category, amount",
        [amount, foundLimit[0].id],
      )
      .then((r) => r.rows[0]);
  } else {
    return await pool
      .query(
        "insert into limits (card, category, amount) values ($1, $2, $3) returning id, card, category, amount",
        [cardId, category, amount],
      )
      .then((r) => r.rows(0));
  }
};

module.exports = {
  pool,
  getUser,
  getTransactionsForMonth,
  getAggregatedTransactionsForMonth,
  getLimitForCategory,
  getCategories,
  getTransactionsInCategory,
  getCardIdForUser,
  createLimit,
};
