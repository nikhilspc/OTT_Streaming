import { useState } from 'react';
import Categories from './Categories';
import Products from './Products';
import Providers from './Providers';
import Subscriptions from './Subscriptions';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab('categories')} className={activeTab === 'categories' ? 'active' : ''}>Categories</button>
        <button onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>Products</button>
        <button onClick={() => setActiveTab('providers')} className={activeTab === 'providers' ? 'active' : ''}>Providers</button>
        <button onClick={() => setActiveTab('subscriptions')} className={activeTab === 'subscriptions' ? 'active' : ''}>Subscriptions</button>
      </div>

      <div className="tab-content">
        {activeTab === 'categories' && <Categories />}
        {activeTab === 'products' && <Products />}
        {activeTab === 'providers' && <Providers />}
        {activeTab === 'subscriptions' && <Subscriptions />}
      </div>
    </div>
  );
}