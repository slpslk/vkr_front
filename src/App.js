import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Gateways from "./pages/Gateways.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gateways" element={<Gateways />} />
        {/* <Route path="/products" element={<Products />} />
                <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
