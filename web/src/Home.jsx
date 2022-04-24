import React from "react";
import CategoryGrid from "./CategoryGrid";
const Home = () => {
  return (
    <div className="container mx-auto my-4 flex flex-col justify-center items-center px-2">
      <div>
        <h1 className="text-6xl font-black">Welcome to Enfauxlope</h1>
      </div>
      <CategoryGrid />
    </div>
  );
};

export default Home;
