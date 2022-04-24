import React from "react";
import CategoryGrid from "./CategoryGrid";
import ComboBox from "./ComboBox";
import MoneyBox from "./MoneyBox";
import CatCreateButton from "./CatCreateButton";


const Home = () => {
  return (
    <>
      <div className="container mx-auto my-4">
        <h1 className="text-6xl font-black">Welcome to Enfauxlope</h1>
        <CategoryGrid />
        <ComboBox />
        <MoneyBox />
        <CatCreateButton />
      </div>
    </>
  );
};

export default Home;
