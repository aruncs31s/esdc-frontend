import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';

const Events = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: 'Arduino Workshop',
          description: 'Learn Arduino programming basics',
          date: '2025-02-15',
          time: '14:00',
          location: 'Lab 101',
          capacity: 30,
          registered: 15
        },
        {
          id: 2,
          title: 'PCB Design Seminar',
          description: 'Introduction to PCB design using KiCad',
          date: '2025-02-20',
          time: '16:00',
          location: 'Conference Room',
          capacity: 25,
          registered: 8
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const registerForEvent = async (eventId) => {
    // API call to register for event
    console.log('Registering for event:', eventId);
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="events-page">
      <div className="container">
        <h1>Club Events</h1>
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className="event-details">
                <div><FaCalendar /> {event.date}</div>
                <div><FaClock /> {event.time}</div>
                <div><FaMapMarkerAlt /> {event.location}</div>
                <div><FaUsers /> {event.registered}/{event.capacity}</div>
              </div>
              {isAuthenticated && (
                <button onClick={() => registerForEvent(event.id)}>
                  Register
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;