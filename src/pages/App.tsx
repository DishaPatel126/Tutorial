import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import AddProduct from "./AddProduct";
import Home from "./Home";
import AboutUs from "./AboutUs";
import Login from "./Login";
import Register from "./Register";
import { AuthProvider } from "../context/AuthContext";
import Prods from "./Prods";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Prods />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
