import { useEffect, useState } from 'react';
import api from '../api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [catName, setCatName] = useState('');
  const [subName, setSubName] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  const fetchData = async () => {
    const catRes = await api.get('categories/');
    setCategories(catRes.data);
    const subRes = await api.get('subcategories/');
    setSubcategories(subRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('categories/', { name: catName });
      setCatName('');
      fetchData();
    } catch (err) {
      alert('Failed to add category. Check permissions.');
    }
  };

  const addSubCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('subcategories/', { name: subName, category: selectedCat });
      setSubName('');
      fetchData();
    } catch (err) {
      alert('Failed to add sub-category.');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`categories/${id}/`);
      fetchData();
    } catch (err) {
      alert('Delete failed — Admin only.');
    }
  };

  return (
    <div>
      <h3>Categories</h3>
      <form onSubmit={addCategory}>
        <input placeholder="New category name" value={catName} onChange={(e) => setCatName(e.target.value)} />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => deleteCategory(c.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Sub Categories</h3>
      <form onSubmit={addSubCategory}>
        <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input placeholder="New sub-category name" value={subName} onChange={(e) => setSubName(e.target.value)} />
        <button type="submit">Add Sub-Category</button>
      </form>
      <ul>
        {subcategories.map((s) => (
          <li key={s.id}>{s.category_name} → {s.name}</li>
        ))}
      </ul>
    </div>
  );
}