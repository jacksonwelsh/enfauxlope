import React from "react";
import CategoryCard from "./CategoryCard";
import Modal from "./Modal";
import { CreditCardIcon } from "@heroicons/react/outline";

const CategoryGrid = () => {
  const [transactions, setTransactions] = React.useState(undefined);
  const [limitModalOpen, setLimitModalOpen] = React.useState(false);

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/transactions/aggregated`)
      .then((r) => r.json())
      .then((t) => setTransactions(t));
  }, []);

  const CreateLimitModal = ({ open, onClose }) => {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={"Create a new limit"}
        icon={<CreditCardIcon className="h-6 w-6 text-blue-600" />}
      >
        <p className="mt-2">Create a limit here.</p>
      </Modal>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4 my-4">
      <CreateLimitModal
        open={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
      />
      <button onClick={() => setLimitModalOpen(true)}>open modal</button>
      {transactions?.map((cat, idx) => (
        <CategoryCard
          internal={cat.internal}
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
