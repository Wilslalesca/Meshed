import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

const roles: Role[] = ['user', 'manager', 'admin'];

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setPending(true);
    try {
      await register({ name, email, password, role });
      nav('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <h2>Create account</h2>
      <label>
        Name
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>
      <label>
        Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </label>
      <label>
        Confirm password
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
      </label>
      <label>
        Role
        <select value={role} onChange={e => setRole(e.target.value as Role)}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={pending}>{pending ? 'Creating…' : 'Create account'}</button>
    </form>
  );
};