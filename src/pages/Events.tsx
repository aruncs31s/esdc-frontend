import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaMapMarkerAlt, FaClock, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import '../styles/events.css';

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
  category?: string;
  difficulty?: string;
}

const Events = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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
          status: 'upcoming',
          category: 'Workshop',
          difficulty: 'Beginner',
        },
        {
          id: 2,
          title: 'PCB Design Seminar',
          description: 'Introduction to PCB design using KiCad and industry best practices',
          date: '2025-02-20',
          time: '16:00',
          location: 'Conference Room',
          capacity: 25,
          registered: 8,
          status: 'upcoming',
          category: 'Seminar',
          difficulty: 'Intermediate',
        },
        {
          id: 3,
          title: 'IoT Hackathon',
          description: '24-hour hackathon focused on IoT solutions with prizes',
          date: '2025-03-05',
          time: '09:00',
          location: 'Main Hall',
          capacity: 50,
          registered: 32,
          status: 'upcoming',
          category: 'Hackathon',
          difficulty: 'Advanced',
        },
        {
          id: 4,
          title: 'Robotics Competition',
          description: 'Annual robotics competition with exciting challenges and awards',
          date: '2025-01-20',
          time: '10:00',
          location: 'Sports Complex',
          capacity: 40,
          registered: 40,
          status: 'completed',
          category: 'Competition',
          difficulty: 'Advanced',
        },
        {
          id: 5,
          title: 'Web Development Bootcamp',
          description: 'Intensive 2-week bootcamp covering React, Node.js, and deployment',
          date: '2025-03-10',
          time: '10:00',
          location: 'Lab 102',
          capacity: 35,
          registered: 28,
          status: 'upcoming',
          category: 'Bootcamp',
          difficulty: 'Intermediate',
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const registerForEvent = async (eventId: number) => {
    console.log('Registering for event:', eventId);
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="events-page">
      <div className="events-background">
        <div className="events-gradient-orb events-orb-1"></div>
        <div className="events-gradient-orb events-orb-2"></div>
        <div className="events-gradient-orb events-orb-3"></div>
      </div>

      <div className="events-container">
        <div className="events-header-section">
          <div className="events-header-wrapper">
            <div className="events-header-icon">
              <FaCalendarAlt size={40} />
            </div>
            <div className="events-header-content">
              <h1>Important Events</h1>
              <p>Join us for exciting workshops, seminars, and competitions</p>
            </div>
          </div>
        </div>

        <div className="events-content">
          {/* Upcoming Events Section */}
          <div className="events-section">
            <h2 className="section-heading">Upcoming Events</h2>
            <div className="events-grid">
              {events
                .filter((e) => e.status === 'upcoming')
                .map((event) => (
                  <div key={event.id} className="event-showcase-card">
                    <div className="card-header">
                      <div className="card-title-section">
                        <h3>{event.title}</h3>
                        {event.category && <span className="event-badge">{event.category}</span>}
                      </div>
                      {event.difficulty && (
                        <span className={`difficulty-badge ${event.difficulty.toLowerCase()}`}>
                          {event.difficulty}
                        </span>
                      )}
                    </div>

                    <p className="card-description">{event.description}</p>

                    <div className="event-meta-grid">
                      <div className="meta-item">
                        <FaClock className="meta-icon" />
                        <div>
                          <div className="meta-label">Date & Time</div>
                          <div className="meta-value">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            at {event.time}
                          </div>
                        </div>
                      </div>
                      <div className="meta-item">
                        <FaMapMarkerAlt className="meta-icon" />
                        <div>
                          <div className="meta-label">Location</div>
                          <div className="meta-value">{event.location}</div>
                        </div>
                      </div>
                      <div className="meta-item">
                        <FaUsers className="meta-icon" />
                        <div>
                          <div className="meta-label">Participants</div>
                          <div className="meta-value">
                            {event.registered}/{event.capacity}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="capacity-bar">
                      <div
                        className="capacity-fill"
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      ></div>
                    </div>

                    {isAuthenticated && event.status === 'upcoming' && (
                      <button
                        className="register-button"
                        onClick={() => registerForEvent(event.id)}
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Completed Events Section */}
          {events.some((e) => e.status === 'completed') && (
            <div className="events-section">
              <h2 className="section-heading">Completed Events</h2>
              <div className="events-grid">
                {events
                  .filter((e) => e.status === 'completed')
                  .map((event) => (
                    <div key={event.id} className="event-showcase-card completed">
                      <div className="card-header">
                        <div className="card-title-section">
                          <h3>{event.title}</h3>
                          {event.category && <span className="event-badge">{event.category}</span>}
                        </div>
                        <span className="completed-badge">Completed</span>
                      </div>

                      <p className="card-description">{event.description}</p>

                      <div className="event-meta-grid">
                        <div className="meta-item">
                          <FaClock className="meta-icon" />
                          <div>
                            <div className="meta-label">Date & Time</div>
                            <div className="meta-value">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              at {event.time}
                            </div>
                          </div>
                        </div>
                        <div className="meta-item">
                          <FaMapMarkerAlt className="meta-icon" />
                          <div>
                            <div className="meta-label">Location</div>
                            <div className="meta-value">{event.location}</div>
                          </div>
                        </div>
                        <div className="meta-item">
                          <FaUsers className="meta-icon" />
                          <div>
                            <div className="meta-label">Attended</div>
                            <div className="meta-value">{event.registered} people</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
