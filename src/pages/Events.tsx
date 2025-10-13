import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaMapMarkerAlt, FaClock, FaUsers, FaList, FaCalendarAlt } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  status: string;
}

const Events = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('timeline');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: 'Arduino Workshop',
          description: 'Learn Arduino programming basics and build your first project',
          date: '2025-02-15',
          time: '14:00',
          location: 'Lab 101',
          capacity: 30,
          registered: 15,
          status: 'upcoming'
        },
        {
          id: 2,
          title: 'PCB Design Seminar',
          description: 'Introduction to PCB design using KiCad',
          date: '2025-02-20',
          time: '16:00',
          location: 'Conference Room',
          capacity: 25,
          registered: 8,
          status: 'upcoming'
        },
        {
          id: 3,
          title: 'IoT Hackathon',
          description: '24-hour hackathon focused on IoT solutions',
          date: '2025-03-05',
          time: '09:00',
          location: 'Main Hall',
          capacity: 50,
          registered: 32,
          status: 'upcoming'
        },
        {
          id: 4,
          title: 'Robotics Competition',
          description: 'Annual robotics competition with exciting challenges',
          date: '2025-01-20',
          time: '10:00',
          location: 'Sports Complex',
          capacity: 40,
          registered: 40,
          status: 'completed'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const registerForEvent = async (eventId: number) => {
    console.log('Registering for event:', eventId);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const renderCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      days.push(
        <div key={day} className={`calendar-day ${dayEvents.length > 0 ? 'has-events' : ''}`}>
          <span className="day-number">{day}</span>
          {dayEvents.length > 0 && (
            <div className="event-dots">
              {dayEvents.slice(0, 3).map(e => (
                <span key={e.id} className="event-dot" title={e.title}></span>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const renderTimeline = () => {
    const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="timeline">
        {sortedEvents.map((event) => (
          <div key={event.id} className={`timeline-item ${event.status}`}>
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <div className="timeline-date">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <div className="event-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div className="event-details">
                  <div className="event-detail-item">
                    <FaClock /> <span>{event.time}</span>
                  </div>
                  <div className="event-detail-item">
                    <FaMapMarkerAlt /> <span>{event.location}</span>
                  </div>
                  <div className="event-detail-item">
                    <FaUsers /> <span>{event.registered}/{event.capacity}</span>
                  </div>
                </div>
                {isAuthenticated && event.status === 'upcoming' && (
                  <button className="btn btn-primary" onClick={() => registerForEvent(event.id)}>
                    Register
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <section className="events-page">
      <div className="container">
        <div className="section-header">
          <h2>Club Events</h2>
          <p>Join us for workshops, seminars, and hands-on learning experiences</p>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${view === 'timeline' ? 'active' : ''}`}
            onClick={() => setView('timeline')}
          >
            <FaList /> Timeline
          </button>
          <button
            className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`}
            onClick={() => setView('calendar')}
          >
            <FaCalendarAlt /> Calendar
          </button>
        </div>

        {view === 'calendar' ? (
          <div className="calendar-view">
            <div className="calendar-header">
              <button onClick={() => changeMonth(-1)} className="month-nav">
                <FiChevronLeft />
              </button>
              <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
              <button onClick={() => changeMonth(1)} className="month-nav">
                <FiChevronRight />
              </button>
            </div>
            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="calendar-weekday">{day}</div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        ) : (
          renderTimeline()
        )}
      </div>
    </section>
  );
};

export default Events;