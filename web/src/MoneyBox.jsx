import React from "react";

const MoneyBox = ({ value, setValue }) => {
  return (
    <div className="my-2">
      <label
        htmlFor="price"
        className="block text-sm font-medium text-gray-400"
      >
        Spending Limit
      </label>
      <div className="mt-1 relative rounded-md shadow-sm w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          value={value}
          onChange={setValue}
          type="text"
          name="price"
          id="price"
          className="focus:ring-indigo-500 focus:border-indigo-500 bg-gray-800 block w-full pl-7 pr-12 sm:text-sm border-gray-700 rounded-md"
          placeholder="0.00"
          aria-describedby="price-currency"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            USD
          </span>
        </div>
      </div>
    </div>
  );
};

export default MoneyBox;
