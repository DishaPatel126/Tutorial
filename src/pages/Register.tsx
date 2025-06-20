import React, { useState } from 'react';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRegister = async () => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      alert('Registration successful! You can log in now.');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} /><br />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} /><br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
