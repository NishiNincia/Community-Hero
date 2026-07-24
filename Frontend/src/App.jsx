import React from 'react';
import RoleSelect from './components/RoleSelect.jsx';
import LoginForm from './components/LoginForm.jsx';
import MainApp from './components/MainApp.jsx';
import { INITIAL_ISSUES } from './data.js';

export default function App() {
  const [screen, setScreen] = React.useState('role'); // 'role' | 'form' | 'main'
  const [role, setRole] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [issues, setIssues] = React.useState(INITIAL_ISSUES);
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleSelectRole = (r) => {
    setRole(r);
    setScreen('form');
  };

  const handleLoggedIn = (u) => {
    setUser(u);
    setScreen('main');
  };

  const handleSignOut = () => {
    setScreen('role');
    setRole(null);
    setUser(null);
  };

  return (
    <>
      {screen === 'role' && <RoleSelect onSelectRole={handleSelectRole} />}
      {screen === 'form' && (
        <LoginForm role={role} onBack={() => setScreen('role')} onLoggedIn={handleLoggedIn} />
      )}
      {screen === 'main' && (
        <MainApp
          role={role}
          user={user}
          issues={issues}
          setIssues={setIssues}
          onSignOut={handleSignOut}
          showToast={showToast}
        />
      )}

      {toast && (
        <div
          className="fu"
          style={{
            position: 'fixed', top: 16, right: 16, zIndex: 999, background: '#10B981', color: '#fff',
            padding: '12px 18px', borderRadius: 12, fontWeight: 600, fontSize: 13, boxShadow: '0 8px 28px rgba(0,0,0,.2)',
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}
