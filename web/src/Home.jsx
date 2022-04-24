import React from "react";
import CategoryGrid from "./CategoryGrid";
import ComboBox from "./ComboBox";
import MoneyBox from "./MoneyBox";
import CatCreateButton from "./CatCreateButton";

const Home = () => {
  const [limit, setLimit] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(undefined);
  const [formLocked, setFormLocked] = React.useState(false);
  const [updateCard, setUpdateCard] = React.useState(false);
  const limitValue = React.useRef(undefined);

  //React.useEffect(() => console.table({ limit }), [limit])

  const checkForm = () => {
    console.log(selectedCategory.internal);
    if (limit === "" || selectedCategory === undefined) {
      console.log("form bad");
    } else {
      fetch(`${process.env.REACT_APP_API_ROOT}/cards/limits`, {
        method: "PUT",
        body: JSON.stringify({
          category: selectedCategory.internal,
          limit: parseInt(parseFloat(limit) * 100),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        setFormLocked(true);
        setUpdateCard((c) => !c);
      });
    }
  };

  const triggerLimitSet = (category) => {
    setSelectedCategory(category);
    limitValue.current.focus();
  }

  return (
    <div
      className="container mx-auto my-4 flex justify-center px-2 md:pr-6 md:mr-2"
      style={{ width: "100vh-250px", float: "right" }}
    >
      <div>
        <h1 className="text-6xl font-black">Welcome to Enfauxlope</h1>
        <CategoryGrid updateCard={updateCard} setLimit={triggerLimitSet} />
        <div className="bg-gradient-to-t from-gray-900/50 to-transparent backdrop-blur absolute bottom-0 w-full -ml-8 grid grid-cols-3 p-4">
          <ComboBox
            selectedCategory={selectedCategory}
            setSelectedCategory={(e) => {
              setSelectedCategory(e);
              setFormLocked(false);
            }}
          />
          <MoneyBox
            value={limit}
            setValue={(e) => {
              setLimit(e.target.value);
              setFormLocked(false);
            }}
            rf={limitValue}
          />
          <CatCreateButton
            locked={formLocked}
            limit={limit}
            selectedCategory={selectedCategory}
            onClick={() => checkForm()}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
