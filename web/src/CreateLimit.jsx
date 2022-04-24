import React from "react";
import { useLocation } from "react-router-dom";

const CreateLimit = () => {
  const location = useLocation();
  console.log({ st: location.state })
  const category = location.state?.category;

  return <div className="container mx-auto my-4">{category}</div>;
};

export default CreateLimit;
