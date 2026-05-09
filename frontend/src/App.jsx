import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Cart from "./pages/Cart/cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AddFood from "./pages/admin/AddFood";
import AdminOrders from "./pages/admin/Orders";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminFoods from "./pages/admin/Foods";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";
import AppNavbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="*"
          element={
            <>
              <AppNavbar />
              <Routes>
                <Route path="/" element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } />
                <Route path="/cart" element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                } />
                <Route path="/orders" element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={(
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  )}
                />
                <Route
                  path="/admin/add-food"
                  element={(
                    <AdminRoute>
                      <AddFood />
                    </AdminRoute>
                  )}
                />
                <Route
                  path="/admin/orders"
                  element={(
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  )}
                />
                <Route
                  path="/admin/foods"
                  element={(
                    <AdminRoute>
                      <AdminFoods />
                    </AdminRoute>
                  )}
                />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;