import React, { useState, useEffect } from 'react';

type Product = {
  id: number;
  title: string;
};

function AddProduct() {
  const [title, setTitle] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fetch error", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddOrUpdate = () => {
    if (!title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    if (editingId !== null) {
      fetch(`http://localhost:5000/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      })
        .then((res) => res.json())
        .then(() => {
          setTitle('');
          setEditingId(null);
          fetchProducts();
        })
        .catch((err) => {
          console.error("Error updating product:", err);
          alert("Failed to update product.");
        });
    } else {
      fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      })
        .then((res) => res.json())
        .then(() => {
          setTitle('');
          fetchProducts();
        })
        .catch((err) => {
          console.error("Error adding product:", err);
          alert("Failed to add product.");
        });
    }
  };

  const handleEdit = (product: Product) => {
    setTitle(product.title);
    setEditingId(product.id);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE"
    })
      .then(() => fetchProducts())
      .catch((err) => {
        console.error("Error deleting product:", err);
        alert("Failed to delete product.");
      });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>{editingId !== null ? 'Update Product' : 'Add Product'}</h1>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddOrUpdate} style={styles.addButton}>
            {editingId !== null ? 'Update' : 'Add'}
          </button>
        </div>

        <h2 style={styles.listTitle}>Product List</h2>
        <ul style={styles.list}>
          {products.map((product) => (
            <li key={product.id} style={styles.listItem}>
              <span>{product.title}</span>
              <div>
                <button style={styles.updateButton} onClick={() => handleEdit(product)}>Update</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddProduct;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: '#f0f4f8',
    minHeight: 'calc(100vh - 60px)', // Account for navbar
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '40px',
    paddingBottom: '40px',
  },
  container: {
    maxWidth: '600px',
    width: '100%',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#2c3e50',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  addButton: {
    padding: '10px 16px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  listTitle: {
    fontSize: '22px',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    marginBottom: '10px',
    padding: '12px 16px',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateButton: {
    marginRight: '10px',
    padding: '6px 12px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};