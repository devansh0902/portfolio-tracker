import { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Edit2, TrendingUp, IndianRupee } from 'lucide-react';

export default function Dashboard({ token, onLogout }) {
  const [assets, setAssets] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', quantity: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', quantity: '', price: '' });

  useEffect(() => {
    fetchProfile();
    fetchAssets();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUser(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/portfolio/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAssets(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError('Failed to load portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/portfolio/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setAssets([...assets, data.data.asset]);
        setFormData({ name: '', quantity: '', price: '' });
        setIsAdding(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAssets(assets.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (asset) => {
    setEditingId(asset.id);
    setEditFormData({ name: asset.name, quantity: asset.quantity, price: asset.price });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({ name: '', quantity: '', price: '' });
  };

  const handleEditAsset = async (e, id) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (res.ok) {
        setAssets(assets.map(a => a.id === id ? data.data.asset : a));
        cancelEdit();
      } else {
        alert(data.message || data.msg || 'Edit failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalValue = assets.reduce((sum, asset) => sum + (asset.quantity * asset.price), 0);

  if (isLoading) return <div className="container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp color="var(--accent-primary)" /> 
            Profolio
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Welcome back, {user?.name || 'Investor'}
          </p>
        </div>
        <button onClick={onLogout} className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* Stats Summary */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Balance</p>
          <h2 style={{ fontSize: '3rem', color: 'var(--text-primary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <IndianRupee size={40} color="var(--success)" />
            {totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsAdding(!isAdding)}>
          <Plus size={18} /> {isAdding ? 'Cancel' : 'Add Asset'}
        </button>
      </div>

      {/* Add Asset Form */}
      {isAdding && (
        <form onSubmit={handleAddAsset} className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Asset Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Bitcoin" required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Quantity</label>
            <input type="number" step="any" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="0.5" required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Price (₹)</label>
            <input type="number" step="any" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="45000" required />
          </div>
          <button type="submit" className="btn-primary" style={{ height: '46px' }}>Save Asset</button>
        </form>
      )}

      {/* Assets Grid */}
      <div>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Your Assets</h3>
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {assets.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>You have no assets in your portfolio yet.</p>
            <button className="btn-primary" style={{ width: 'auto', margin: '1rem auto 0' }} onClick={() => setIsAdding(true)}>Add your first asset</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {assets.map(asset => (
              <div key={asset.id} className="glass-panel" style={{ padding: '1.5rem', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } }}>
                {editingId === asset.id ? (
                  <form onSubmit={(e) => handleEditAsset(e, asset.id)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Asset Name</label>
                      <input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: 'white' }} required />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Quantity</label>
                        <input type="number" step="any" value={editFormData.quantity} onChange={e => setEditFormData({...editFormData, quantity: e.target.value})} style={{ width: '100%', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: 'white' }} required />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Price (₹)</label>
                        <input type="number" step="any" value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value})} style={{ width: '100%', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: 'white' }} required />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Save</button>
                      <button type="button" onClick={cancelEdit} className="btn-danger" style={{ flex: 1, padding: '0.5rem', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)' }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.25rem' }}>{asset.name}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEdit(asset)} className="btn-primary" style={{ padding: '6px', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(asset.id)} className="btn-danger" style={{ padding: '6px' }} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Holdings</p>
                        <p style={{ fontWeight: 600 }}>{asset.quantity}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Avg Price</p>
                        <p style={{ fontWeight: 600 }}>₹{asset.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Value</span>
                      <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                        ₹{(asset.quantity * asset.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
