import React from "react";
import { Link } from "react-router-dom";
const CategoryCard = ({ internal, name, limit, amount }) => {
  const barWidth = Math.min(100, Math.round((100 * amount) / limit));
  let color = "bg-blue-600";
  if (barWidth >= 100) color = "bg-red-600";

  const handleClick = () => {
    // Simple GET request using fetch
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/transactions`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <Link to={`/categories/${internal}`}>
      <div
        className="w-full h-full bg-gray-800 font-mono px-4 py-2 hover:cursor-pointer"
        onClick={() => handleClick()}
      >
        <h4 className="font-bold">{name}</h4>
        <p>
          You've spent ${(amount / 100).toFixed(2)}{" "}
          {limit && <>of your ${(limit / 100).toFixed(2)} limit </>}this month.
        </p>
        {limit ? (
          <div className="w-full mx-2 h-2 my-2 bg-gray-700">
            <div className={`${color} h-2`} style={{ width: `${barWidth}%` }} />
          </div>
        ) : (
          <button className="w-full py-0.5 mt-2 bg-indigo-700">
            Set a limit
          </button>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
