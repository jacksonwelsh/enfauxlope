import React from "react";
import CategoryGrid from "./CategoryGrid";

const Home = () => {
  return (
    <>
      <div className="container mx-auto my-4">
        <h1 className="text-6xl font-black">Welcome to Enfauxlope</h1>
        <CategoryGrid />
      </div>
    </>
  );
};

export default Home;
