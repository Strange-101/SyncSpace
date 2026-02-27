import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import PreJoinLobby from './pages/PreJoinLobby';
import Workspace from './pages/Workspace';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public — Combined Landing + Login/Signup */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/lobby/:roomId" element={
            <ProtectedRoute>
              <PreJoinLobby />
            </ProtectedRoute>
          } />
          <Route path="/workspace/:roomId" element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;