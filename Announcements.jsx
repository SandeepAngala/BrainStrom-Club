import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { announcementAPI } from '../services/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const categories = ['General', 'Academic', 'Event', 'Important', 'Club News'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedCategory, selectedPriority]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedPriority) params.priority = selectedPriority;
      
      const response = await announcementAPI.getAll(params);
      setAnnouncements(response.data.announcements || response.data);
    } catch (err) {
      setError('Failed to load announcements. Please try again later.');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'Urgent': return 'danger';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryVariant = (category) => {
    switch (category) {
      case 'Important': return 'danger';
      case 'Academic': return 'success';
      case 'Event': return 'primary';
      case 'Club News': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading announcements...</p>
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
              <h1 className="text-gradient mb-3">Club Announcements</h1>
              <p className="lead">
                Stay informed with the latest updates, news, and important information from Brainstorm Club
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search announcements..."
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
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Announcements List */}
        <Row>
          {filteredAnnouncements.length === 0 ? (
            <Col>
              <Alert variant="info" className="text-center">
                No announcements found matching your criteria.
              </Alert>
            </Col>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Col lg={12} key={announcement._id} className="mb-4">
                <Card className="slide-up">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">{announcement.title}</h5>
                    </div>
                    <div className="d-flex gap-2">
                      <Badge bg={getCategoryVariant(announcement.category)}>
                        {announcement.category}
                      </Badge>
                      <Badge bg={getPriorityVariant(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-3">{announcement.content}</p>
                    
                    <div className="d-flex justify-content-between align-items-center text-muted">
                      <div className="d-flex align-items-center gap-3">
                        <span>
                          <FaUser className="me-1" />
                          {announcement.author}
                        </span>
                        <span>
                          <FaCalendarAlt className="me-1" />
                          {new Date(announcement.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {announcement.expiryDate && (
                        <small>
                          Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                        </small>
                      )}
                    </div>

                    {announcement.tags && announcement.tags.length > 0 && (
                      <div className="mt-3">
                        {announcement.tags.map((tag, index) => (
                          <Badge key={index} bg="light" text="dark" className="me-1">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <div className="mt-3">
                        <strong>Attachments:</strong>
                        <ul className="mt-2">
                          {announcement.attachments.map((attachment, index) => (
                            <li key={index}>
                              <a href={attachment.path} target="_blank" rel="noopener noreferrer">
                                {attachment.filename}
                              </a>
                              <small className="text-muted ms-2">
                                ({Math.round(attachment.size / 1024)} KB)
                              </small>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Summary Stats */}
        <Row className="mt-5">
          <Col>
            <Card className="bg-light">
              <Card.Body className="text-center">
                <h5>Quick Stats</h5>
                <Row>
                  <Col md={3}>
                    <strong>{filteredAnnouncements.length}</strong>
                    <br />
                    <small className="text-muted">Total Announcements</small>
                  </Col>
                  <Col md={3}>
                    <strong>
                      {filteredAnnouncements.filter(a => a.priority === 'Urgent').length}
                    </strong>
                    <br />
                    <small className="text-muted">Urgent</small>
                  </Col>
                  <Col md={3}>
                    <strong>
                      {filteredAnnouncements.filter(a => a.category === 'Important').length}
                    </strong>
                    <br />
                    <small className="text-muted">Important</small>
                  </Col>
                  <Col md={3}>
                    <strong>
                      {filteredAnnouncements.filter(a => 
                        new Date(a.publishDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length}
                    </strong>
                    <br />
                    <small className="text-muted">This Week</small>
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

export default Announcements;