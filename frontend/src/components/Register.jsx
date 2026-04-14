import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Route to login on successful registration
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            height: '64px', width: '64px', borderRadius: '50%', background: 'var(--accent-glow)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
            border: '1px solid var(--accent-primary)'
          }}>
            <UserPlus size={28} color="var(--accent-primary)" />
          </div>
          <h2>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Join to manage your portfolio</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe" 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Min 6 characters" 
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
            {isLoading ? 'Creating account...' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
