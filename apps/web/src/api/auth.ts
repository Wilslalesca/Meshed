import { type AuthResponse, type LoginCredentials, type RegisterCredentials, type Role } from '../types/auth';
import { uid } from '../utils/id';

const DB_KEY = 'mockdb.users';
const PW_KEY = 'mockdb.passwords'; // email -> plaintext (mock ONLY)

interface DbUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

function delay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readUsers(): DbUser[] {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as DbUser[]; } catch { return []; }
}

function writeUsers(users: DbUser[]) {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

function readPasswords(): Record<string, string> {
  const raw = localStorage.getItem(PW_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw) as Record<string, string>; } catch { return {}; }
}

function writePasswords(map: Record<string, string>) {
  localStorage.setItem(PW_KEY, JSON.stringify(map));
}

function seedOnce() {
  const users = readUsers();
  if (users.length > 0) return;
  const pw = readPasswords();
  const seed: Array<{ name: string; email: string; role: Role; password: string; }> = [
    { name: 'Admin', email: 'admin@example.com', role: 'admin', password: 'admin123' },
    { name: 'Manager', email: 'manager@example.com', role: 'manager', password: 'manager123' },
    { name: 'Standard User', email: 'user@example.com', role: 'user', password: 'user123' },
  ];
  const db: DbUser[] = seed.map(s => ({ id: uid('u'), name: s.name, email: s.email, role: s.role }));
  writeUsers(db);
  const map: Record<string, string> = {};
  seed.forEach((s, i) => { map[db[i].email] = s.password; });
  writePasswords(map);
}

seedOnce();

function makeToken(u: DbUser): string {
  // mock token; replace with real JWT later
  return `mocktoken_${u.id}_${Date.now()}`;
}

export async function apiLogin(input: LoginCredentials): Promise<AuthResponse> {
  await delay();
  const users = readUsers();
  const pw = readPasswords();
  const found = users.find(u => u.email.toLowerCase() === input.email.toLowerCase());
  if (!found) {
    throw new Error('Invalid email or password');
  }
  if (pw[found.email] !== input.password) {
    throw new Error('Invalid email or password');
  }
  const token = makeToken(found);
  return {
    token,
    user: { id: found.id, name: found.name, email: found.email, role: found.role },
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1h
  };
}

export async function apiRegister(input: RegisterCredentials): Promise<AuthResponse> {
  await delay();
  const users = readUsers();
  const pw = readPasswords();
  const exists = users.some(u => u.email.toLowerCase() === input.email.toLowerCase());
  if (exists) {
    throw new Error('Email already in use');
  }
  const role: Role = input.role ?? 'user';
  const newUser: DbUser = { id: uid('u'), name: input.name, email: input.email, role };
  const next = [...users, newUser];
  writeUsers(next);
  pw[newUser.email] = input.password; // MOCK ONLY
  writePasswords(pw);
  const token = makeToken(newUser);
  return {
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
  };
}

export async function apiMe(token: string): Promise<DbUser | null> {
  await delay(200);
  // minimal token parsing to find user id
  const parts = token.split('_');
  const id = parts.length >= 3 ? parts[1] : '';
  if (!id) return null;
  const users = readUsers();
  const u = users.find(x => x.id === id);
  return u ?? null;
}