import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaUsers } from 'react-icons/fa';
import { eventAPI } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('upcoming'); // 'all', 'upcoming', 'past'

  const categories = ['Workshop', 'Seminar', 'Competition', 'Social', 'Meeting', 'Conference', 'Other'];
  const statuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedStatus, viewMode]);

  const fetchEvents = async () => {
  try {
    setLoading(true);

    // Static mock events
    const mockEvents = [
      {
        _id: "1",
        title: "AI Workshop",
        description: "Learn the basics of Artificial Intelligence and Machine Learning.",
        category: "Workshop",
        status: "Upcoming",
        date: "2025-07-25",
        time: "10:00 AM - 2:00 PM",
        location: "Auditorium A",
        organizer: "Tech Club",
        currentParticipants: 30,
        maxParticipants: 100,
        registrationRequired: true,
        registrationDeadline: "2025-07-23",
        contactEmail: "aiworkshop@campusconnect.com",
        tags: ["AI", "ML", "Tech"],
      },
      {
        _id: "2",
        title: "Business Plan Competition",
        description: "Pitch your startup idea to a panel of investors and win funding.",
        category: "Competition",
        status: "Ongoing",
        date: "2025-07-20",
        time: "1:00 PM - 5:00 PM",
        location: "Conference Hall B",
        organizer: "Entrepreneurship Cell",
        currentParticipants: 12,
        maxParticipants: 20,
        registrationRequired: false,
        contactEmail: "bplan@campusconnect.com",
        tags: ["Startup", "Business", "Competition"],
      },
      {
        _id: "3",
        title: "Mental Health Seminar",
        description: "Join experts to discuss student mental wellness and stress relief.",
        category: "Seminar",
        status: "Completed",
        date: "2025-06-10",
        time: "11:00 AM - 1:00 PM",
        location: "Health Center",
        organizer: "Wellbeing Society",
        currentParticipants: 60,
        maxParticipants: 60,
        registrationRequired: false,
        contactEmail: "wellness@campusconnect.com",
        tags: ["Health", "Seminar"],
      }
    ];

    // Apply basic filtering for demo
    const filtered = mockEvents.filter(e => {
      const matchCategory = !selectedCategory || e.category === selectedCategory;
      const matchStatus = !selectedStatus || e.status === selectedStatus;
      const isUpcoming = viewMode !== 'upcoming' || new Date(e.date) >= new Date();
      return matchCategory && matchStatus && isUpcoming;
    });

    setEvents(filtered);
  } catch (err) {
    setError('Failed to load mock events.');
    console.error('Mock fetch failed:', err);
  } finally {
    setLoading(false);
  }
};

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Upcoming': return 'primary';
      case 'Ongoing': return 'success';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getCategoryVariant = (category) => {
    switch (category) {
      case 'Workshop': return 'info';
      case 'Seminar': return 'success';
      case 'Competition': return 'warning';
      case 'Social': return 'primary';
      case 'Meeting': return 'secondary';
      case 'Conference': return 'dark';
      default: return 'light';
    }
  };

  const isEventPast = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header Section */}
      <section className="bg-light py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1 className="text-gradient mb-3">Club Events</h1>
              <p className="lead">
                Discover and participate in exciting workshops, seminars, competitions, and social events
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* View Mode Tabs */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex gap-2 mb-3">
              <Button
                variant={viewMode === 'upcoming' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('upcoming')}
              >
                Upcoming Events
              </Button>
              <Button
                variant={viewMode === 'all' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('all')}
              >
                All Events
              </Button>
            </div>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Events Grid */}
        <Row>
          {filteredEvents.length === 0 ? (
            <Col>
              <Alert variant="info" className="text-center">
                No events found matching your criteria.
              </Alert>
            </Col>
          ) : (
            filteredEvents.map((event) => (
              <Col lg={6} xl={4} key={event._id} className="mb-4">
                <Card className={`event-card slide-up h-100 ${isEventPast(event.date) ? 'opacity-75' : ''}`}>
                  {event.image && (
                    <Card.Img
                      variant="top"
                      src={`/uploads/events/${event.image.filename}`}
                      className="event-image"
                      alt={event.title}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Badge bg={getCategoryVariant(event.category)}>
                          {event.category}
                        </Badge>
                        <Badge bg={getStatusVariant(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                      <Card.Title className="h5">{event.title}</Card.Title>
                    </div>

                    <Card.Text className="flex-grow-1">
                      {event.description}
                    </Card.Text>

                    <div className="event-details">
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="me-2 text-primary" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaClock className="me-2 text-success" />
                        <span>{event.time}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaMapMarkerAlt className="me-2 text-danger" />
                        <span>{event.location}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaUser className="me-2 text-info" />
                        <span>{event.organizer}</span>
                      </div>

                      {event.maxParticipants && (
                        <div className="d-flex align-items-center mb-2">
                          <FaUsers className="me-2 text-warning" />
                          <span>
                            {event.currentParticipants}/{event.maxParticipants} participants
                          </span>
                        </div>
                      )}

                      {event.registrationRequired && (
                        <div className="mt-3">
                          <small className="text-muted">
                            <strong>Registration Required</strong>
                            {event.registrationDeadline && (
                              <span>
                                <br />Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                              </span>
                            )}
                          </small>
                        </div>
                      )}

                      {event.requirements && (
                        <div className="mt-2">
                          <small className="text-muted">
                            <strong>Requirements:</strong> {event.requirements}
                          </small>
                        </div>
                      )}

                      {event.contactEmail && (
                        <div className="mt-2">
                          <small>
                            <strong>Contact:</strong>{' '}
                            <a href={`mailto:${event.contactEmail}`}>
                              {event.contactEmail}
                            </a>
                          </small>
                        </div>
                      )}

                      {event.tags && event.tags.length > 0 && (
                        <div className="mt-3">
                          {event.tags.map((tag, index) => (
                            <Badge key={index} bg="light" text="dark" className="me-1">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Event Statistics */}
        <Row className="mt-5">
          <Col>
            <Card className="bg-light">
              <Card.Body>
                <h5 className="text-center mb-4">Event Statistics</h5>
                <Row className="text-center">
                  <Col md={2}>
                    <strong>{filteredEvents.length}</strong>
                    <br />
                    <small className="text-muted">Total Events</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredEvents.filter(e => e.status === 'Upcoming').length}
                    </strong>
                    <br />
                    <small className="text-muted">Upcoming</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredEvents.filter(e => e.status === 'Ongoing').length}
                    </strong>
                    <br />
                    <small className="text-muted">Ongoing</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredEvents.filter(e => e.category === 'Workshop').length}
                    </strong>
                    <br />
                    <small className="text-muted">Workshops</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredEvents.filter(e => e.category === 'Competition').length}
                    </strong>
                    <br />
                    <small className="text-muted">Competitions</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredEvents.filter(e => e.registrationRequired).length}
                    </strong>
                    <br />
                    <small className="text-muted">Need Registration</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Events;