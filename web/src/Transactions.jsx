import { useParams } from "react-router-dom";
import React from "react";
const Transactions = () => {
  let params = useParams();

  const [category, setCategoryName] = React.useState(undefined);

  React.useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_ROOT}/cards/transactions/category/` +
        params.category
    )
      .then((r) => r.json())
      .then((t) => setCategoryName(t));
  }, [params.category]);

console.log(category?.transactions.map((t) => t.amount));

  return (
    <>
      <div className="container mx-auto my-4">
        <h1 className="text-6xl font-black">
          {category?.extname} Transactions
        </h1>
        <br/>
        <h2 className="text-2xl font-black">
          Total spent:{" $"}
          {Object.values(category?.transactions ?? {}).reduce(
            (prev, curr) => (prev += curr.amount /100),
            0
          )}
        </h2>
      </div>
    </>
  );
};

export default Transactions;
