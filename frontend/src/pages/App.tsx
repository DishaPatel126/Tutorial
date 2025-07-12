import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import AddProduct from "./AddProduct";
import Home from "./Home";
import AboutUs from "./AboutUs";
import Login from "./Login";
import Register from "./Register";
import { AuthProvider } from "../context/AuthContext";
import Prods from "./Prods";
import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "./LandingPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
        
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/Home"
            element={<ProtectedRoute><Home /></ProtectedRoute>}
          />
          <Route
            path="/AboutUs"
            element={<ProtectedRoute><AboutUs /></ProtectedRoute>}
          />
          <Route
            path="/AddProduct"
            element={<ProtectedRoute><AddProduct /></ProtectedRoute>}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Prods /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
