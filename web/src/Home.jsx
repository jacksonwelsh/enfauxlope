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
  const [declinedTransactions, setTransactions] = React.useState(undefined);
  const [infoBanner, setInfoBanner] = React.useState(undefined);
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

  const override = (id, name) => {
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/override/${id}`, {
      method: "POST",
    }).then(() => {
      setTransactions([]);
      setInfoBanner(
        `Successfully overrode the decline on <strong>${name}</strong>.`
      );
    });
  };

  const triggerLimitSet = (category) => {
    setSelectedCategory(category);
    limitValue.current.focus();
  };

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/transactions/declined`)
      .then((r) => r.json())
      .then((t) => setTransactions(t));
  }, []);

  return (
    <div className="z-10 container mx-auto my-4 flex justify-center px-2 md:pr-6 md:mr-2 overflow-scroll h-full flex-wrap">
      {declinedTransactions?.length > 0 && (
        <div className="p-2 bg-red-600/75 font-mono w-full mt-1 mb-4 flex items-center justify-between">
          <p>
            We declined a transaction from{" "}
            <strong>{declinedTransactions[0].merchant_name}</strong> (
            {declinedTransactions[0].external}) for{" "}
            <strong>
              ${(declinedTransactions[0].amount / 100).toFixed(2)}
            </strong>
          </p>
          <button
            className="bg-gray-100 font-bold px-2 text-gray-900 py-1 float-right"
            onClick={() => override(declinedTransactions[0].id, declinedTransactions[0].merchant_name)}
          >
            Override
          </button>
        </div>
      )}
      {infoBanner && (
        <div className="p-2 bg-teal-600/75 font-mono w-full mt-1 mb-4 flex items-center justify-between">
          <p dangerouslySetInnerHTML={{ __html: infoBanner }} />
        </div>
      )}
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
