import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBullhorn, FaTasks, FaUsers } from 'react-icons/fa';
import { announcementAPI, eventAPI, activityAPI, leadershipAPI } from '../services/api';

const Home = () => {
  const [data, setData] = useState({
    announcements: [],
    events: [],
    activities: [],
    leadership: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        const [announcementsRes, eventsRes, activitiesRes, leadershipRes] = await Promise.all([
          announcementAPI.getAll({ limit: 3 }),
          eventAPI.getUpcoming(),
          activityAPI.getHighlighted(),
          leadershipAPI.getMainLeadership()
        ]);

        setData({
          announcements: announcementsRes.data.announcements || announcementsRes.data,
          events: eventsRes.data,
          activities: activitiesRes.data,
          leadership: leadershipRes.data
        });
      } catch (err) {
        // setError('Failed to load homepage data. Please try again later.');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <h1 className="hero-title">Welcome to Brainstorm Club</h1>
              <p className="hero-subtitle">
                Empowering minds, building futures, and creating lasting impact through 
                innovation, collaboration, and endless possibilities.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button as={Link} to="/events" variant="light" size="lg">
                  Explore Events
                </Button>
                <Button as={Link} to="/activities" variant="outline-light" size="lg">
                  View Projects
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {error && (
        <Container className="mt-4">
          <Alert variant="danger">{error}</Alert>
        </Container>
      )}

      {/* Leadership Section */}
      <section className="section-padding">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="text-gradient">Our Leadership</h2>
              <p className="lead">Meet the visionary leaders guiding our club</p>
            </Col>
          </Row>
          <Row>
            {data.leadership.slice(0, 3).map((leader) => (
              <Col md={4} key={leader._id} className="mb-4">
                <Card className="leadership-card slide-up">
                  {leader.image && (
                    <img
                      src={`/uploads/leadership/${leader.image.filename}`}
                      alt={leader.name}
                      className="leadership-img"
                    />
                  )}
                  <h5 className="leadership-name">{leader.name}</h5>
                  <p className="leadership-position">{leader.position}</p>
                  <p className="text-muted">{leader.department}</p>
                  {leader.bio && (
                    <p className="small">{leader.bio.substring(0, 100)}...</p>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
          <Row>
            <Col className="text-center">
              <Button as={Link} to="/leadership" variant="outline-primary">
                <FaUsers className="me-2" />
                View All Leadership
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quick Info Cards */}
      <section className="bg-light section-padding">
        <Container>
          <Row>
            <Col md={3} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaBullhorn size={48} className="text-primary mb-3" />
                  <Card.Title>Latest Announcements</Card.Title>
                  <Card.Text>Stay updated with our latest news and important information</Card.Text>
                  <Button as={Link} to="/announcements" variant="outline-primary">
                    View All
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaCalendarAlt size={48} className="text-success mb-3" />
                  <Card.Title>Upcoming Events</Card.Title>
                  <Card.Text>Join us for exciting workshops, seminars, and networking events</Card.Text>
                  <Button as={Link} to="/events" variant="outline-success">
                    View Calendar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaTasks size={48} className="text-warning mb-3" />
                  <Card.Title>Club Activities</Card.Title>
                  <Card.Text>Explore our ongoing projects and collaborative initiatives</Card.Text>
                  <Button as={Link} to="/activities" variant="outline-warning">
                    See Projects
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaUsers size={48} className="text-info mb-3" />
                  <Card.Title>Join Our Community</Card.Title>
                  <Card.Text>Connect with like-minded students and build lasting relationships</Card.Text>
                  <Button as={Link} to="/contact" variant="outline-info">
                    Get Involved
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Recent Announcements */}
      <section className="section-padding">
        <Container>
          <Row className="mb-4">
            <Col>
              <h3 className="text-gradient">Recent Announcements</h3>
            </Col>
            <Col xs="auto">
              <Button as={Link} to="/announcements" variant="outline-primary" size="sm">
                View All
              </Button>
            </Col>
          </Row>
          <Row>
            {data.announcements.slice(0, 3).map((announcement) => (
              <Col md={4} key={announcement._id} className="mb-3">
                <div className={`announcement-item ${announcement.priority === 'Urgent' ? 'announcement-urgent' : announcement.priority === 'High' ? 'announcement-high' : ''}`}>
                  <h6 className="fw-bold">{announcement.title}</h6>
                  <p className="mb-2">{announcement.content.substring(0, 100)}...</p>
                  <small className="text-muted">
                    {new Date(announcement.publishDate).toLocaleDateString()}
                  </small>
                  <div className="mt-2">
                    <span className={`badge bg-${announcement.priority === 'Urgent' ? 'danger' : announcement.priority === 'High' ? 'warning' : 'info'}`}>
                      {announcement.priority}
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Upcoming Events */}
      <section className="bg-light section-padding">
        <Container>
          <Row className="mb-4">
            <Col>
              <h3 className="text-gradient">Upcoming Events</h3>
            </Col>
            <Col xs="auto">
              <Button as={Link} to="/events" variant="outline-primary" size="sm">
                View Calendar
              </Button>
            </Col>
          </Row>
          <Row>
            {data.events.slice(0, 3).map((event) => (
              <Col md={4} key={event._id} className="mb-4">
                <Card className="event-card">
                  {event.image && (
                    <Card.Img
                      variant="top"
                      src={`/uploads/events/${event.image.filename}`}
                      className="event-image"
                      alt={event.title}
                    />
                  )}
                  <Card.Body>
                    <div className="event-date">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text>{event.description.substring(0, 100)}...</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">📍 {event.location}</small>
                      <small className="text-muted">⏰ {event.time}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Activities */}
      <section className="section-padding">
        <Container>
          <Row className="mb-4">
            <Col>
              <h3 className="text-gradient">Featured Activities</h3>
            </Col>
            <Col xs="auto">
              <Button as={Link} to="/activities" variant="outline-primary" size="sm">
                View All Projects
              </Button>
            </Col>
          </Row>
          <Row>
            {data.activities.slice(0, 3).map((activity) => (
              <Col md={4} key={activity._id} className="mb-4">
                <Card className="activity-card">
                  <div className={`activity-status status-${activity.status.toLowerCase().replace(' ', '-')}`}>
                    {activity.status}
                  </div>
                  {activity.images && activity.images[0] && (
                    <Card.Img
                      variant="top"
                      src={`/uploads/activities/${activity.images[0].filename}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                      alt={activity.title}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{activity.title}</Card.Title>
                    <Card.Text>{activity.description.substring(0, 100)}...</Card.Text>
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">{activity.type}</small>
                      <small className="text-muted">
                        {new Date(activity.startDate).toLocaleDateString()}
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;