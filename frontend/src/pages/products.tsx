import { useState, useEffect } from "react";

type Product = {
  id: number;
  title: string;
};

function ProductDummy() {
  const [data, setData] = useState<Product[]>([]);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${baseUrl}/api/products`)
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