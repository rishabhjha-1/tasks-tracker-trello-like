'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Developer {
  _id: string;
  name: string;
}

export default function CreateTask() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [title, setTitle] = useState<string>('');
  const [developerId, setDeveloperId] = useState<string>('');

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assign Developer</label>
          <select
            value={developerId}
            onChange={(e) => setDeveloperId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
