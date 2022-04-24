import React from "react";
import { useParams } from "react-router-dom";

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

  // let params = useParams();

  // const [transactions, setTransactions] = React.useState(undefined);

  // React.useEffect(() => {
  //   fetch(
  //     `${process.env.REACT_APP_API_ROOT}/cards/transactions/`
  //   )
  //     .then((r) => r.json())
  //     .then((t) => setCategoryName(t));
  // }, [params.category]);

  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-transparent backdrop-blur z-10 hidden md:block md:w-64 lg:w-80 mr-6 h-screen p-4">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h2 className="font-bold text-xl">Welcome back, Johnny. Here are your most recent transactions</h2>
          <br />
          <div className="grid grid-cols-2">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
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
