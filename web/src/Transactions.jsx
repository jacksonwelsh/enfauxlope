import { useParams } from "react-router-dom";
import React from "react";
const Transactions = () => {
  let params = useParams();

  const [category, setCategoryName] = React.useState(undefined);

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/transactions/category/` + params.category)
      .then((r) => r.json())
      .then((t) => setCategoryName(t));
  }, [params.category]);


  return (
    <>
      <div className="container mx-auto my-4">
        <h1 className="text-6xl font-black">{category?.extname} Transactions</h1>
      </div>
    </>
  );
};

export default Transactions;
