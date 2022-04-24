import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Transactions from "./Transactions";

const App = () => {
  return (
    <Router className="bg-gray-900 text-gray-50">
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
