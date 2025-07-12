import React from "react";
import { useState, useEffect } from "react";

type Product = {
  id: number;
  title: string;
};

function ProductDummy() {
  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Fetch error", err));
  }, []);

  return (
    <>
      <h2>Product List</h2>
      {data.map((item) => (
        <p key={item.id}>{item.title}</p>
      ))}
    </>
  );
}

export default ProductDummy;