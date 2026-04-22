import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Cart from "./pages/Cart/cart";
import Login from "./pages/Login/login";
import AppNavbar from "./Components/navbar";

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;