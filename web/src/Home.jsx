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
  };

  return (
    <div className="z-10 container mx-auto my-4 flex justify-center px-2 md:pr-6 md:mr-2 overflow-scroll h-full flex-wrap">
      <div className="p-2 bg-red-600/75 font-mono w-full mt-1 mb-4 flex items-center justify-between">
        <p>
          We declined a transaction from <strong>Gaming, Inc.</strong> (Computer
          Games) for <strong>$69.01</strong>
        </p>
        <button className="bg-gray-100 font-bold px-2 text-gray-900 py-1 float-right">
          Override
        </button>
      </div>
      <div className="h-full pb-24">
        <h1 className="text-6xl font-black">Welcome to Enfauxlope</h1>
        <CategoryGrid updateCard={updateCard} setLimit={triggerLimitSet} />
        <div className="bg-gradient-to-t from-gray-900/50 to-transparent backdrop-blur absolute bottom-0 w-full -ml-8 grid grid-cols-3 p-4 h-32">
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
            neg={parseInt(limit) < 0}
            onClick={() => checkForm()}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
