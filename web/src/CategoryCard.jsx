import React from "react";

const CategoryCard = ({ name, limit, amount }) => {
  const barWidth = Math.min(100, Math.round((100 * amount) / limit));
  let color = "bg-blue-600";
  if (barWidth >= 100) color = "bg-red-600";
  return (
    <div className="w-full h-full bg-gray-800 font-mono px-4 py-2">
      <h4 className="font-bold">{name}</h4>
      <p>
        You've spent ${(amount / 100).toFixed(2)} of your $
        {(limit / 100).toFixed(2)} limit this month.
      </p>
      <div className="w-auto mx-2 h-2 my-2 bg-gray-700">
        <div className={`${color} h-2`} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
};

export default CategoryCard;
