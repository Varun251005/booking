import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Cart from "./pages/Cart/cart";
import Login from "./pages/Login/login";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/admin/Dashboard";
import AddFood from "./pages/admin/AddFood";
import AdminOrders from "./pages/admin/Orders";
import AppNavbar from "./Components/navbar";

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-food" element={<AddFood />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;