import React from "react";
import CategoryCard from "./CategoryCard";

const CategoryGrid = () => {
  const categories = [
    {
      friendly: "Advertising",
      internal: "advertising_services",
    },
    {
      friendly: "Advertising",
      internal: "advertising_services",
    },
    {
      friendly: "Advertising",
      internal: "advertising_services",
    },
    {
      friendly: "Advertising",
      internal: "advertising_services",
    },
    {
      friendly: "Advertising",
      internal: "advertising_services",
    },
    {
      friendly: "Advertising",
      internal: "advertising_services",
    },
    {
      friendly: "Advertising",
      internal: "advertising_services",
    },
    {
      friendly: "Advertising",
      internal: "advertising_services",
    },
    {
      friendly: "Advertising",
      internal: "advertising_services",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 my-4">
      {categories.map((cat, idx) => (
        <CategoryCard
          name={cat.friendly}
          amount={Math.random() * 10000}
          limit={Math.random() * 10000}
          key={idx}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
