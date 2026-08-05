import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';
import Header from '../components/Header';
import CreateEventForm from '../components/CreateEventForm';
import EventsList from '../components/EventsList';
import './DashboardPage.css';

function DashboardPage() {
  const token = useAuthStore((s) => s.token);
  const fetchUsers = useEventStore((s) => s.fetchUsers);
  const fetchEvents = useEventStore((s) => s.fetchEvents);

  useEffect(() => {
    if (!token) return;
    fetchUsers();
    fetchEvents();
  }, [token, fetchUsers, fetchEvents]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <Header />
      <main className="dash-grid">
        <CreateEventForm />
        <EventsList />
      </main>
    </div>
  );
}

export default DashboardPage;
