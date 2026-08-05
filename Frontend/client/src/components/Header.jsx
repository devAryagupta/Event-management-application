import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  return (
    <header className="dash-header">
      <div>
        <h1>Event Management</h1>
        <p>Create and manage events across multiple timezones.</p>
      </div>

      <div className="profile-menu">
        <button
          type="button"
          className="profile-btn"
          onClick={() => setOpen((v) => !v)}
        >
          {user?.name || 'Account'}
          <span aria-hidden="true">▾</span>
        </button>

        {open ? (
          <div className="profile-dropdown">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;