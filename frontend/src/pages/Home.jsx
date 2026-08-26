import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchCategories = async () => {
    const res = await api.get('categories/');
    setCategories(res.data);
  };

  const fetchProducts = async () => {
    let url = 'products/?';
    if (search) url += `search=${search}&`;
    if (categoryFilter) url += `category=${categoryFilter}&`;
    const res = await api.get(url);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter]);

  return (
    <div className="home-container">
      <h2>Browse Content</h2>

      <div className="filters">
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="product-grid">
        {products.length === 0 && <p>No content found.</p>}
        {products.map((p) => (
          <Link to={`/product/${p.id}`} key={p.id} className="product-card">
            <img src={p.thumbnail_url || 'https://via.placeholder.com/200x280'} alt={p.title} />
            <h4>{p.title}</h4>
            <p>{p.category_name} | ⭐ {p.average_rating || 'No ratings'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}