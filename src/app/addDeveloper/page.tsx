"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddDeveloper = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter(); // useRouter for navigation

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Send the developer info to the API
    const response = await fetch('/api/developer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Developer added successfully');
      setName(''); // Clear the input after successful submission
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add Developer</h1>
      
      {/* Navigation Buttons */}
      <div style={styles.navButtons}>
        <button 
          style={styles.button} 
          onClick={() => router.push('/createTasks')}
        >
          Add Tasks
        </button>
        <button 
          style={styles.button} 
          onClick={() => router.push('/')}
        >
          Go to Board
        </button>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Developer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>Add Developer</button>
      </form>
      
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Basic styling for the component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    padding: '20px',
  },
  heading: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  navButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 15px',
    margin: '0 10px',
    fontSize: '1em',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '1em',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '1em',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '10px',
    fontSize: '1em',
    color: '#ff0000',
  },
};

export default AddDeveloper;
