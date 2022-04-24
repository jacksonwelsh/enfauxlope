import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Transactions from "./Transactions";

const App = () => {
  return (
    <Router className="bg-gray-900 text-gray-50">
      <div className="flex w-full h-8 px-4 py-1 font-mono bg-black justify-between items-center">
        <Link
          to="/"
          className="font-bold tracking-wider bg-gradient-to-tr from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          ENFAUXLOPE
        </Link>
        <Link to="/create" className="text-gray-300 text-sm hover:underline">
          Create a new limit
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/categories/:category" element={<Transactions />} />
      </Routes>
    </Router>
  );
};

export default App;
