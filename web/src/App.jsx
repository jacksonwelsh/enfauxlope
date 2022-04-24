import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CardDetails from "./CardDetails";
import CreateLimit from "./CreateLimit";
import Home from "./Home";
import SideBar from "./SideBar";
import Transactions from "./Transactions";

const App = () => {
  return (
    <Router className="text-gray-50 overflow-hidden">
      <div className="z-10 flex w-full h-8 px-4 py-1 font-mono bg-black justify-between items-center">
        <Link
          to="/"
          className="font-bold tracking-wider bg-gradient-to-tr from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase"
        >
          Enfauxlope
        </Link>
        <div className="grid grid-flow-col grid-rows-1 gap-6">
          <Link to="/card" className="text-gray-300 text-sm hover:underline hover:text-white">
            About your card
          </Link>
          <Link to="/create" className="text-gray-300 text-sm hover:underline hover:text-white">
            Create a new limit
          </Link>
        </div>
      </div>
      <div className="z-10 flex overflow-hidden h-screen">        
      <SideBar />      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateLimit />} />
          <Route path="/card" element={<CardDetails />} />
          <Route path="/categories/:category" element={<Transactions />} />
        </Routes>
      </div>      
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </Router>
  );
};

export default App;
