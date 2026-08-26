import { useEffect, useState } from 'react';
import api from '../api';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchProviders = async () => {
    const res = await api.get('providers/');
    setProviders(res.data);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('providers/', { name, contact_email: email });
      setName('');
      setEmail('');
      fetchProviders();
    } catch (err) {
      alert('Failed to add provider.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`providers/${id}/`);
      fetchProviders();
    } catch (err) {
      alert('Delete failed — Admin only.');
    }
  };

  return (
    <div>
      <h3>Providers</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="Provider name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Contact email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Add Provider</button>
      </form>
      <ul>
        {providers.map((p) => (
          <li key={p.id}>
            {p.name} ({p.contact_email})
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}