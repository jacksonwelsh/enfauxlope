import React from "react";
import CategoryGrid from "./CategoryGrid";
const Home = () => {
  return (
    <div className="container mx-auto my-4 flex justify-center px-2 md:pr-6 md:mr-2" style={{width: "100vh-250px", float: "right"}}>  
      <div>
        <h1 className="text-6xl font-black">Welcome to Enfauxlope</h1>
        <CategoryGrid />
      </div>
       
    </div>
  );
};

export default Home;
