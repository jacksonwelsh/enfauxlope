import React from "react";
import { useLocation } from "react-router-dom";

const CreateLimit = () => {
  const location = useLocation();
  console.log({ st: location.state });
  const category = location.state?.category;

  return (
    <div className="container mx-auto my-4 px-2 md:pr-6 md:mr-2">
      {category}
    </div>
  );
};

export default CreateLimit;
