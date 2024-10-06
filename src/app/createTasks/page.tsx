"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Developer {
  _id: string;
  name: string;
}

export default function CreateTask() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [title, setTitle] = useState<string>('');
  const [developerId, setDeveloperId] = useState<string>('');
  const router = useRouter(); // for navigation

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const { data } = await axios.get('/api/developer');
        setDevelopers(data);
      } catch (error) {
        console.error('Error fetching developers:', error);
      }
    };

    fetchDevelopers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/tasks', {
        title,
        developer: developerId,
      });

      console.log('Task created:', response.data);
      setTitle(''); // Reset form fields after submission
      setDeveloperId('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Create Task</h1>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button
          onClick={() => router.push('/')}
          className="btn btn-primary"
        >
          Go to Board
        </button>
        <button
          onClick={() => router.push('/addDeveloper')}
          className="btn btn-secondary"
        >
          Add Developers
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="label">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label className="label">Assign Developer</label>
          <select
            value={developerId}
            onChange={(e) => setDeveloperId(e.target.value)}
            className="input"
            required
          >
            <option value="">Select a developer</option>
            {developers.map((developer) => (
              <option key={developer._id} value={developer._id}>
                {developer.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-submit">
          Create Task
        </button>
      </form>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .heading {
          font-size: 2.5rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .button-group {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .label {
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .input {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          width: 100%;
        }

        .btn-submit {
          background-color: #28a745;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .btn-submit:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
}
