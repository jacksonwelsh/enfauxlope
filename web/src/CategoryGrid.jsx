import React from "react";
import CategoryCard from "./CategoryCard";
import Modal from "./Modal";

const CategoryGrid = () => {
  const [transactions, setTransactions] = React.useState(undefined);

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/transactions/aggregated`)
      .then((r) => r.json())
      .then((t) => setTransactions(t));
  }, []);

  const CreateLimitModal = () => {
    return <Modal />;
  };

  return (
    <div className="grid grid-cols-3 gap-4 my-4">
      <CreateLimitModal />
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
