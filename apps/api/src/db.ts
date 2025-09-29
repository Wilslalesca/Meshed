import fs from 'fs';
import path from 'path';
import { User } from './types';

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');

let users: User[] = [];


function ensureFile() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]', 'utf-8');
}


export function loadUsers() {
    try {
        ensureFile();
        const raw = fs.readFileSync(usersFile, 'utf-8');
        users = JSON.parse(raw) as User[];
    } 
    catch {
        users = [];
    }
}

export function saveUsers() {
    try {
        ensureFile();
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
    } 
    catch {}
}

export const db = {
    all: () => users,
    findByEmail: (email: string) => users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null,
    findById: (id: string) => users.find(u => u.id === id) ?? null,
    insert: (u: User) => { users.push(u); saveUsers(); return u; },
    update: (u: User) => { const i = users.findIndex(x => x.id === u.id); if (i>=0) { users[i]=u; saveUsers(); } return u; },
};

