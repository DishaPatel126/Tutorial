import React from 'react';

function LandingPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome to Landing Page</h1>
        <p style={styles.subtext}>This is your landing page before login. Use the navbar to register or login.</p>
        <a href="https://github.com/DishaPatel126/Tutorial-2" target="_blank" rel="noopener noreferrer">Github Repo Link</a>
      </div>
    </div>
  );
}

export default LandingPage;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: '#f0f4f8',
    minHeight: 'calc(100vh - 60px)',
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  subtext: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '30px',
  },
  image: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    padding: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
};