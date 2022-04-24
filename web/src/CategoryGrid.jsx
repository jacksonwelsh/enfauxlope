import React from "react";
import CategoryCard from "./CategoryCard";

const CategoryGrid = () => {
  const [transactions, setTransactions] = React.useState(undefined);

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/transactions/aggregated`)
      .then((r) => r.json())
      .then((t) => setTransactions(t));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 my-4">
      {transactions?.map((cat, idx) => (
          <CategoryCard
            name={cat.external}
            amount={cat.amount}
            limit={cat.limit}
            key={idx}
          />
        ))}
    </div>
  );
};

export default CategoryGrid;
