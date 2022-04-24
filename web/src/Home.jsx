import React from "react";
import CategoryGrid from "./CategoryGrid";
import Modal from "./Modal";

const Home = () => {
  return (
    <div className="container mx-auto my-4">
      <h1 className="text-6xl font-black">Welcome to Enfauxlope</h1>
      <Modal title="hey gamers" icon="yo" open={true} onClose={() => {}}>
        what
      </Modal>
      <CategoryGrid />
    </div>
  );
};

export default Home;
