import React from "react";

const barLevel = () => {
  const barWidth = Math.min(100, Math.random() * 100);
  let color = "bg-blue-600";
  if (barWidth >= 50) color = "bg-white";
  if (barWidth >= 70) color = "bg-yellow-500";
  if (barWidth >= 80) color = "bg-orange-500";
  if (barWidth >= 90) color = "bg-red-600";

  return { barWidth, color };
};

const SideBar = () => {
  const bars = [];
  for (let i = 0; i < 4; i++) {
    bars.push(barLevel());
  }

  const [transactions, setTransactions] = React.useState(undefined);

  React.useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_ROOT}/cards/transactions/`
    )
      .then((r) => r.json())
      .then((t) => setTransactions(t.data.slice(0,5)));
  }, []);

  transactions?.map((t) => {return console.log({merchant: t.name, amount: t.amount.toFixed(2)});});


  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-transparent backdrop-blur z-10 hidden md:block md:w-64 lg:w-80 mr-6 h-screen p-4">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h2 className="font-bold text-xl text-center">Welcome back, Johnny. Here are your most recent transactions:</h2>
          <br />
          <div className="grid grid-cols-2 gap-2 items-center text-center">
          <div className="font-bold underline">Merchant</div>
          <div className="font-bold underline">Amount</div>
          {transactions?.map((t) => {
            return (
              <>
                <div>{t.name}</div>
                <div>${t.amount.toFixed(2)}</div>
              </>
            );
          })}

          </div>

        </div>
        <div className="pb-4 text-center">
          <h2 className="font-bold text-xl">Your Current Kudos</h2>

          <div className="flex flex-col items-center text-2xl pt-1">
            EXP
            <div className="w-full mx-2 h-6 my-2 bg-gray-700">
              <div
                className={`bg-blue-700 h-6`}
                style={{ width: `${bars[0].barWidth}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center text-2xl pt-1">
            Percent Saved Goal
            <div className="w-full mx-2 h-6 my-2 bg-gray-700">
              <div
                className={`bg-green-700 h-6`}
                style={{ width: `${bars[1].barWidth}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center text-2xl pt-1">
            Wellness Karma
            <div className="w-full mx-2 h-6 my-2 bg-gray-700">
              <div
                className={`bg-yellow-400 h-6`}
                style={{ width: `${bars[2].barWidth}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
