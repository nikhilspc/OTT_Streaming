import { useEffect, useState } from 'react';
import api from '../api';

export default function Subscriptions() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ plan_name: '', price: '', duration_days: '', features: '', quality_tier: 'SD' });

  const fetchPlans = async () => {
    const res = await api.get('subscriptions/');
    setPlans(res.data);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('subscriptions/', form);
      setForm({ plan_name: '', price: '', duration_days: '', features: '', quality_tier: 'SD' });
      fetchPlans();
    } catch (err) {
      alert('Failed to add plan.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`subscriptions/${id}/`);
      fetchPlans();
    } catch (err) {
      alert('Delete failed — Admin only.');
    }
  };

  return (
    <div>
      <h3>Subscription Plans</h3>
      <form onSubmit={handleSubmit}>
        <input name="plan_name" placeholder="Plan name" value={form.plan_name} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="duration_days" placeholder="Duration (days)" value={form.duration_days} onChange={handleChange} />
        <input name="features" placeholder="Features" value={form.features} onChange={handleChange} />
        <select name="quality_tier" value={form.quality_tier} onChange={handleChange}>
          <option value="SD">SD</option>
          <option value="HD">HD</option>
          <option value="4K">4K</option>
        </select>
        <button type="submit">Add Plan</button>
      </form>
      <ul>
        {plans.map((p) => (
          <li key={p.id}>
            {p.plan_name} — ₹{p.price} / {p.duration_days} days
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}