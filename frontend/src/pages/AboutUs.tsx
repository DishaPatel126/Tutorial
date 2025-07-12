import React from 'react';

function AboutUs() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>About Us</h1>
        <p style={styles.text}>
          Welcome to our product dashboard! This application was designed to help you manage items
          easily with the ability to add, update, and delete products.
        </p>
        <a href="https://github.com/DishaPatel126/Tutorial-2" target="_blank" rel="noopener noreferrer">Github Repo Link</a>
      </div>
    </div>
  );
}

export default AboutUs;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: '#f0f4f8',
    minHeight: 'calc(100vh - 60px)', // Account for navbar
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '40px',
    maxWidth: '700px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  text: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
};
