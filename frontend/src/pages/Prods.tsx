import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Product = {
  id: number;
  title: string;
  quantity: number;
};

function Prods() {
  const { token, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${baseUrl}/api/products`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => alert("Unauthorized or server error"));
  }, [token, navigate]);

  return (
    <div>
      <h2>Product Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.id} - {p.title} ({p.quantity})</li>
        ))}
      </ul>
    </div>
  );
}

export default Prods;
