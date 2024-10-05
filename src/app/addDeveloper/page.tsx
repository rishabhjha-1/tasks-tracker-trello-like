"use client"
import { useState } from 'react';

const AddDeveloper = () => {
  const [name, setName] = useState('');
  const [, setMessage] = useState('');

  const handleSubmit = async (e:any) => {
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
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Developer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
       
        <button type="submit">Add Developer</button>
      </form>
    </div>
  );
};

export default AddDeveloper;
