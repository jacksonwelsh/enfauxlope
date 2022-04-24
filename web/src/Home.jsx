import React, { useEffect } from "react";
import CategoryGrid from "./CategoryGrid";
import ComboBox from "./ComboBox";
import MoneyBox from "./MoneyBox";
import CatCreateButton from "./CatCreateButton";


const Home = () => {
  const [limit, setLimit] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(undefined)

  //React.useEffect(() => console.table({ limit }), [limit])

  const checkForm = () => {
    console.log(selectedCategory.internal)
    if(limit === '' || selectedCategory === undefined){
      console.log("form bad")
    }
    else {
      fetch(`${process.env.REACT_APP_API_ROOT}/cards/limits`, 
      {
        method: 'PUT',
        body: JSON.stringify({
          category: selectedCategory.internal,
          limit: limit
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((console.log("success")));

      console.log("GOODODODOD")
      //make card
    }
  };

  return (
    <div className="container mx-auto my-4 flex justify-center px-2" style={{width: "100vh-250px", float: "right"}}>  
      <div>
        <h1 className="text-6xl font-black">Welcome to Enfauxlope</h1>
        <CategoryGrid />
        <ComboBox selectedCategory={selectedCategory} setSelectedCategory={(e) => setSelectedCategory(e)}/>
        <MoneyBox value={limit} setValue={(e) => setLimit(e.target.value)} />
        <CatCreateButton limit={limit} selectedCategory={selectedCategory} onClick={() => checkForm()} />
      </div>
    </div>
  );
};

export default Home;
