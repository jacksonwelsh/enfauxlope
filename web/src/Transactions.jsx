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

  return (
    <div className="container mx-auto my-4 px-2 md:mr-6 md:pr-2">
      <h1 className="text-6xl font-black">{category?.extname} Transactions</h1>
      <br />
      <h2 className="text-2xl font-black">
        Total spent:{" $"}
        {Object.values(category?.transactions ?? {})
          .reduce((prev, curr) => (prev += curr.amount / 100), 0)
          .toFixed(2)}
      </h2>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800 text-gray-200/75 cursor-default">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide sm:pl-6"
                    >
                      Merchant Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    >
                      State
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900 text-gray-100 font-mono">
                  {category?.transactions.map((t, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-bold">
                        {t.merchant_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        ${(t.amount / 100).toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {t.city}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {t.state}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {new Date(t.created).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
