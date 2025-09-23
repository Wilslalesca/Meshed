import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RequireRole } from './routes/RequireRole';
import { Home } from './screens/Home';
import LoginPage from './screens/Login';
import { Register } from './screens/Register';
import { Dashboard } from './screens/Dashboard';
import { Admin } from './screens/Admin';
import { Manager } from './screens/Manager';
import { Profile } from './screens/Profile';
import { Nav } from './components/Nav';


export default function App() {
  return (
    <div>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <RequireRole allow="admin">
              <Admin />
            </RequireRole>
          } />

          <Route path="/manager" element={
            <RequireRole allow={["manager", "admin"]}>
              <Manager />
            </RequireRole>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}