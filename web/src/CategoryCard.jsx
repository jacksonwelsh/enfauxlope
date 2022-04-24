import React from "react";
import { Link } from "react-router-dom";
const CategoryCard = ({ internal, name, limit, amount, setLimit }) => {
  const barWidth = Math.min(100, Math.round((100 * amount) / limit));
  let color = "bg-blue-600";
  if (barWidth >= 50) color = "bg-white";
  if (barWidth >= 70) color = "bg-yellow-500";
  if (barWidth >= 80) color = "bg-orange-500";
  if (barWidth >= 90) color = "bg-red-600";

  const handleClick = () => {
    // Simple GET request using fetch
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/transactions`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <Link to={`/categories/${internal}`}>
      <div
        className="w-full h-full bg-gray-800 font-mono px-4 py-2 hover:cursor-pointer flex flex-wrap"
        onClick={() => handleClick()}
      >
        <h4 className="font-bold w-full text-lg">{name}</h4>
        <p className="w-full my-1">
          You've spent ${(amount / 100).toFixed(2)}{" "}
          {limit !== undefined && <>of your ${(limit / 100).toFixed(2)} limit </>}this month.
        </p>
        {limit !== undefined ? (
          <div className="w-full mx-2 h-2 my-2 bg-gray-700">
            <div className={`${color} h-2`} style={{ width: `${barWidth}%` }} />
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              setLimit({ internal, external: name });
            }}
            className="w-full "
          >
            <div className="w-full py-0.5 mt-2 bg-indigo-700 text-center">
              Set a limit
            </div>
          </button>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
