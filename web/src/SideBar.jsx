import React from "react";

const barLevel = () => {
  const barWidth = Math.min(100, Math.random()*100);
          let color = "bg-blue-600";
          if (barWidth >= 50) color = "bg-white";
          if (barWidth >= 70) color = "bg-yellow-500";
          if (barWidth >= 80) color = "bg-orange-500";
          if (barWidth >= 90) color = "bg-red-600";
  
  return {barWidth, color};
}

const SideBar = () => {
  const bars = [];
  for (let i = 0; i < 4; i++) {
    bars.push(barLevel());
  }

  return (
    <div className="bg-gray-900 z-10 hidden md:block md:w-64 lg:w-80 mr-6 h-screen p-4">
      <h2 className="font-bold text-4xl">Your Activity</h2>

      <div className="flex flex-col items-center text-2xl" style={{paddingTop: "20px"}}>
        Rewards
        <div className="w-full mx-2 h-2 my-2 bg-gray-700">
            <div className={`${bars[0].color} h-2`} style={{ width: `${bars[0].barWidth}%` }} />
        </div>
      </div>

      <div className="flex flex-col items-center text-2xl" style={{paddingTop: "20px"}}>
        EXP
        <div className="w-full mx-2 h-2 my-2 bg-gray-700">
            <div className={`${bars[1].color} h-2`} style={{ width: `${bars[1].barWidth}%` }} />
        </div>
      </div>

      <div className="flex flex-col items-center text-2xl" style={{paddingTop: "20px"}}>
        Money
        <div className="w-full mx-2 h-2 my-2 bg-gray-700">
            <div className={`${bars[2].color} h-2`} style={{ width: `${bars[2].barWidth}%` }} />
        </div>
      </div>

      <div className="flex flex-col items-center text-2xl" style={{paddingTop: "20px"}}>
        Social Karma
        <div className="w-full mx-2 h-2 my-2 bg-gray-700">
        <div className={`${bars[3].color} h-2`} style={{ width: `${bars[3].barWidth}%` }} />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
