import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import ProductDummy from './products'
import Counter from './counter'
import AddProduct from './AddProduct'
import Home from './Home'
import AboutUs from './AboutUs'


function App() {
  return(
    // <p><ProductDummy/></p>
    // <p><Counter/></p>
    <BrowserRouter>
    <Layout/>
    <Routes>
    <Route path="/Home" element={<Home/>} />
    <Route path="/AddProduct" element={<AddProduct/>} />
    <Route path="/AboutUs" element={<AboutUs/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
