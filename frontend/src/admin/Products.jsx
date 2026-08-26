import { useEffect, useState } from 'react';
import api from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [providers, setProviders] = useState([]);

  const [form, setForm] = useState({
    title: '', description: '', thumbnail_url: '', video_url: '',
    category: '', sub_category: '', provider: '', content_rating: 'U'
  });

  const fetchAll = async () => {
    const [p, c, s, pr] = await Promise.all([
      api.get('products/'),
      api.get('categories/'),
      api.get('subcategories/'),
      api.get('providers/'),
    ]);
    setProducts(p.data);
    setCategories(c.data);
    setSubcategories(s.data);
    setProviders(pr.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('products/', form);
      setForm({ title: '', description: '', thumbnail_url: '', video_url: '', category: '', sub_category: '', provider: '', content_rating: 'U' });
      fetchAll();
    } catch (err) {
      alert('Failed to add product. Check all fields / permissions.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`products/${id}/`);
      fetchAll();
    } catch (err) {
      alert('Delete failed — Admin only.');
    }
  };

  return (
    <div>
      <h3>Products</h3>
      <form onSubmit={handleSubmit} className="product-form">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="thumbnail_url" placeholder="Thumbnail URL" value={form.thumbnail_url} onChange={handleChange} />
        <input name="video_url" placeholder="Video Embed URL" value={form.video_url} onChange={handleChange} />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select name="sub_category" value={form.sub_category} onChange={handleChange}>
          <option value="">Select Sub-Category</option>
          {subcategories.map((s) => <option key={s.id} value={s.id}>{s.category_name} → {s.name}</option>)}
        </select>

        <select name="provider" value={form.provider} onChange={handleChange}>
          <option value="">Select Provider</option>
          {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <button type="submit">Add Product</button>
      </form>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.title} — {p.category_name} → {p.sub_category_name}
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}