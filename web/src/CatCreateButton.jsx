import React from "react";

// const checkForm = ({selectedCategory}) => {
//     console.log(selectedCategory.external)
//     // console.log(ComboBox.event)
//     // if(selectedCategory === undefined){
//     //     console.log("undefined ComboBox value\n")
//     // }
//     // else{
//     //     console.log(selectedCategory)
//     // }
// }

const CatCreateButton = ({ locked, onClick, neg }) => {
  return (
    <button
      className={`${
        locked
          ? neg
            ? "bg-red-200 cursor-not-allowed text-gray-900"
            : "bg-blue-200 cursor-not-allowed text-gray-900"
          : neg
          ? "bg-red-600"
          : "bg-blue-600"
      } h-10 font-mono text-center w-max my-auto hover:bg-blue-dark text-white font-bold py-2 px-4`}
      onClick={onClick}
      disabled={locked}
    >
      {locked
        ? neg
          ? "Limit Removed"
          : "Limit Added"
        : neg
        ? "Remove Limit"
        : "Add Limit"}
    </button>
  );
};

export default CatCreateButton;
