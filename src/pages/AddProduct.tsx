import React, { useState, useEffect } from "react";

type Product = {
  id: number;
  title: string;
  quantity: number;
};

function AddProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
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

  const handleAddProduct = () => {
    if (!id || !title.trim() || !quantity) {
      alert("All fields are required.");
      return;
    }

    const url =
      editingId !== null
        ? `http://localhost:5000/api/products/${editingId}`
        : "http://localhost:5000/api/products";

    const method = editingId !== null ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(id),
        title,
        quantity: Number(quantity),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save");
        return res.json();
      })
      .then(() => {
        setId("");
        setTitle("");
        setQuantity("");
        setEditingId(null);
        setShowForm(false);
        fetchProducts();
      })
      .catch((err) => {
        console.error("Error saving product:", err);
        alert("Failed to save product.");
      });
  };

  const handleEdit = (product: Product) => {
    setShowForm(true);
    setId(String(product.id));
    setTitle(product.title);
    setQuantity(String(product.quantity));
    setEditingId(product.id);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
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
        <h1 style={styles.heading}>Product Dashboard</h1>

        {!showForm && (
          <button style={styles.toggleButton} onClick={() => setShowForm(true)}>
            Add Product
          </button>
        )}

        {showForm && (
          <div style={styles.form}>
            <input
              style={styles.input}
              placeholder="Product ID"
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Product Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div style={styles.buttonGroup}>
              <button onClick={handleAddProduct} style={styles.addButton}>
                {editingId !== null ? "Update" : "Submit"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setId("");
                  setTitle("");
                  setQuantity("");
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <h2 style={styles.listTitle}>Product List</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "10%" }}>ID</th>
              <th style={{ ...styles.th, width: "40%" }}>Product Name</th>
              <th style={{ ...styles.th, width: "20%" }}>Quantity</th>
              <th style={{ ...styles.th, width: "30%", textAlign: "center" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={styles.tr}>
                <td style={styles.td}>{product.id}</td>
                <td style={styles.td}>{product.title}</td>
                <td style={styles.td}>{product.quantity}</td>
                <td
                  style={{
                    ...styles.td,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  <button
                    style={styles.updateButton}
                    onClick={() => handleEdit(product)}
                  >
                    Update
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddProduct;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: "#f0f4f8",
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    justifyContent: "center",
    paddingTop: "40px",
    paddingBottom: "40px",
  },
  container: {
    maxWidth: "800px",
    width: "100%",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#2c3e50",
  },
  toggleButton: {
    padding: "10px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  listTitle: {
    fontSize: "22px",
    marginBottom: "10px",
    color: "#2c3e50",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    tableLayout: "fixed",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#eeeeee",
    borderBottom: "2px solid #ddd",
  },
  tr: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "10px",
  },
  updateButton: {
    marginRight: "10px",
    padding: "6px 12px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

// import React, { useState, useEffect } from 'react';

// type Product = {
//   id: number;
//   title: string;
// };

// function AddProduct() {
//   const [title, setTitle] = useState('');
//   const [products, setProducts] = useState<Product[]>([]);
//   const [editingId, setEditingId] = useState<number | null>(null);

//   const fetchProducts = () => {
//     fetch("http://localhost:5000/api/products")
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//       .catch((err) => console.error("Fetch error", err));
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleAddOrUpdate = () => {
//     if (!title.trim()) {
//       alert("Title cannot be empty");
//       return;
//     }

//     if (editingId !== null) {
//       fetch(`http://localhost:5000/api/products/${editingId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title })
//       })
//         .then((res) => res.json())
//         .then(() => {
//           setTitle('');
//           setEditingId(null);
//           fetchProducts();
//         })
//         .catch((err) => {
//           console.error("Error updating product:", err);
//           alert("Failed to update product.");
//         });
//     } else {
//       fetch("http://localhost:5000/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title })
//       })
//         .then((res) => res.json())
//         .then(() => {
//           setTitle('');
//           fetchProducts();
//         })
//         .catch((err) => {
//           console.error("Error adding product:", err);
//           alert("Failed to add product.");
//         });
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setTitle(product.title);
//     setEditingId(product.id);
//   };

//   const handleDelete = (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;

//     fetch(`http://localhost:5000/api/products/${id}`, {
//       method: "DELETE"
//     })
//       .then(() => fetchProducts())
//       .catch((err) => {
//         console.error("Error deleting product:", err);
//         alert("Failed to delete product.");
//       });
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <h1 style={styles.heading}>{editingId !== null ? 'Update Product' : 'Add Product'}</h1>
//         <div style={styles.inputContainer}>
//           <input
//             type="text"
//             placeholder="Enter product title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             style={styles.input}
//           />
//           <button onClick={handleAddOrUpdate} style={styles.addButton}>
//             {editingId !== null ? 'Update' : 'Add'}
//           </button>
//         </div>

//         <h2 style={styles.listTitle}>Product List</h2>
//         <ul style={styles.list}>
//           {products.map((product) => (
//             <li key={product.id} style={styles.listItem}>
//               <span>{product.title}</span>
//               <div>
//                 <button style={styles.updateButton} onClick={() => handleEdit(product)}>Update</button>
//                 <button style={styles.deleteButton} onClick={() => handleDelete(product.id)}>Delete</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default AddProduct;

// const styles: { [key: string]: React.CSSProperties } = {
//   page: {
//     backgroundColor: '#f0f4f8',
//     minHeight: 'calc(100vh - 60px)', // Account for navbar
//     display: 'flex',
//     justifyContent: 'center',
//     paddingTop: '40px',
//     paddingBottom: '40px',
//   },
//   container: {
//     maxWidth: '600px',
//     width: '100%',
//     fontFamily: 'Arial, sans-serif',
//     backgroundColor: '#ffffff',
//     padding: '30px',
//     borderRadius: '10px',
//     boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
//   },
//   heading: {
//     fontSize: '28px',
//     marginBottom: '20px',
//     textAlign: 'center',
//     color: '#2c3e50',
//   },
//   inputContainer: {
//     display: 'flex',
//     gap: '10px',
//     marginBottom: '25px',
//   },
//   input: {
//     flex: 1,
//     padding: '10px',
//     fontSize: '16px',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//   },
//   addButton: {
//     padding: '10px 16px',
//     fontSize: '16px',
//     backgroundColor: '#4CAF50',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   listTitle: {
//     fontSize: '22px',
//     marginBottom: '10px',
//     color: '#2c3e50',
//   },
//   list: {
//     listStyle: 'none',
//     padding: 0,
//   },
//   listItem: {
//     backgroundColor: '#f9f9f9',
//     marginBottom: '10px',
//     padding: '12px 16px',
//     borderRadius: '6px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   updateButton: {
//     marginRight: '10px',
//     padding: '6px 12px',
//     backgroundColor: '#2196F3',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   deleteButton: {
//     padding: '6px 12px',
//     backgroundColor: '#f44336',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   }
// };
