import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt, FaUser, FaUsers, FaTrophy, FaCog } from 'react-icons/fa';
import { activityAPI } from '../services/api';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'highlighted', 'current'

  const types = ['Project', 'Competition', 'Workshop', 'Community Service', 'Research', 'Achievement', 'Other'];
  const statuses = ['Planned', 'In Progress', 'Completed', 'On Hold'];

  useEffect(() => {
    fetchActivities();
  }, [selectedType, selectedStatus, viewMode]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let response;
      
      if (viewMode === 'highlighted') {
        response = await activityAPI.getHighlighted();
      } else {
        const params = {};
        if (selectedType) params.type = selectedType;
        if (selectedStatus) params.status = selectedStatus;
        if (viewMode === 'current') params.status = 'In Progress';
        
        response = await activityAPI.getAll(params);
      }
      
      setActivities(response.data.activities || response.data);
    } catch (err) {
      setError('Failed to load activities. Please try again later.');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.leader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Planned': return 'info';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'On Hold': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeVariant = (type) => {
    switch (type) {
      case 'Project': return 'primary';
      case 'Competition': return 'danger';
      case 'Workshop': return 'info';
      case 'Community Service': return 'success';
      case 'Research': return 'dark';
      case 'Achievement': return 'warning';
      default: return 'light';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading activities...</p>
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
              <h1 className="text-gradient mb-3">Club Activities & Projects</h1>
              <p className="lead">
                Explore our innovative projects, competitions, workshops, and community initiatives
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
                variant={viewMode === 'all' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('all')}
              >
                All Activities
              </Button>
              <Button
                variant={viewMode === 'highlighted' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('highlighted')}
              >
                Featured
              </Button>
              <Button
                variant={viewMode === 'current' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('current')}
              >
                In Progress
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
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
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

        {/* Activities Grid */}
        <Row>
          {filteredActivities.length === 0 ? (
            <Col>
              <Alert variant="info" className="text-center">
                No activities found matching your criteria.
              </Alert>
            </Col>
          ) : (
            filteredActivities.map((activity) => (
              <Col lg={6} xl={4} key={activity._id} className="mb-4">
                <Card className="activity-card slide-up h-100">
                  {activity.isHighlighted && (
                    <div className="position-absolute top-0 start-0 p-2">
                      <Badge bg="warning">
                        <FaTrophy className="me-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  
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

                  <Card.Body className="d-flex flex-column">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Badge bg={getTypeVariant(activity.type)}>
                          {activity.type}
                        </Badge>
                        <Badge bg={getStatusVariant(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                      <Card.Title className="h5">{activity.title}</Card.Title>
                    </div>

                    <Card.Text className="flex-grow-1">
                      {activity.description}
                    </Card.Text>

                    <div className="activity-details">
                      <div className="d-flex align-items-center mb-2">
                        <FaUser className="me-2 text-primary" />
                        <span><strong>Leader:</strong> {activity.leader}</span>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="me-2 text-success" />
                        <span>
                          <strong>Started:</strong> {formatDate(activity.startDate)}
                        </span>
                      </div>

                      {activity.endDate && (
                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt className="me-2 text-danger" />
                          <span>
                            <strong>End:</strong> {formatDate(activity.endDate)}
                          </span>
                        </div>
                      )}

                      {activity.participants && activity.participants.length > 0 && (
                        <div className="d-flex align-items-center mb-2">
                          <FaUsers className="me-2 text-info" />
                          <span>
                            <strong>Participants:</strong> {activity.participants.length}
                          </span>
                        </div>
                      )}

                      {/* Participants List */}
                      {activity.participants && activity.participants.length > 0 && (
                        <div className="mt-3">
                          <small className="text-muted">
                            <strong>Team Members:</strong>
                          </small>
                          <ul className="mt-1 mb-0" style={{ fontSize: '0.9rem' }}>
                            {activity.participants.slice(0, 3).map((participant, index) => (
                              <li key={index}>
                                {participant.name} {participant.role && `(${participant.role})`}
                              </li>
                            ))}
                            {activity.participants.length > 3 && (
                              <li>
                                <small className="text-muted">
                                  +{activity.participants.length - 3} more...
                                </small>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Technologies */}
                      {activity.technologies && activity.technologies.length > 0 && (
                        <div className="mt-3">
                          <small className="text-muted mb-2 d-block">
                            <FaCog className="me-1" />
                            <strong>Technologies:</strong>
                          </small>
                          <div>
                            {activity.technologies.slice(0, 4).map((tech, index) => (
                              <Badge key={index} bg="secondary" className="me-1 mb-1">
                                {tech}
                              </Badge>
                            ))}
                            {activity.technologies.length > 4 && (
                              <Badge bg="light" text="dark" className="me-1">
                                +{activity.technologies.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {activity.skills && activity.skills.length > 0 && (
                        <div className="mt-3">
                          <small className="text-muted mb-2 d-block">
                            <strong>Skills:</strong>
                          </small>
                          <div>
                            {activity.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} bg="info" className="me-1 mb-1">
                                {skill}
                              </Badge>
                            ))}
                            {activity.skills.length > 3 && (
                              <Badge bg="light" text="dark" className="me-1">
                                +{activity.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      {activity.achievements && activity.achievements.length > 0 && (
                        <div className="mt-3">
                          <small className="text-muted">
                            <FaTrophy className="me-1" />
                            <strong>Achievements:</strong>
                          </small>
                          <ul className="mt-1 mb-0" style={{ fontSize: '0.85rem' }}>
                            {activity.achievements.slice(0, 2).map((achievement, index) => (
                              <li key={index}>
                                {achievement.title}
                                {achievement.date && (
                                  <small className="text-muted">
                                    {' '}({new Date(achievement.date).getFullYear()})
                                  </small>
                                )}
                              </li>
                            ))}
                            {activity.achievements.length > 2 && (
                              <li>
                                <small className="text-muted">
                                  +{activity.achievements.length - 2} more achievements...
                                </small>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Tags */}
                      {activity.tags && activity.tags.length > 0 && (
                        <div className="mt-3">
                          {activity.tags.map((tag, index) => (
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

        {/* Activity Statistics */}
        <Row className="mt-5">
          <Col>
            <Card className="bg-light">
              <Card.Body>
                <h5 className="text-center mb-4">Activity Statistics</h5>
                <Row className="text-center">
                  <Col md={2}>
                    <strong>{filteredActivities.length}</strong>
                    <br />
                    <small className="text-muted">Total Activities</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredActivities.filter(a => a.status === 'In Progress').length}
                    </strong>
                    <br />
                    <small className="text-muted">In Progress</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredActivities.filter(a => a.status === 'Completed').length}
                    </strong>
                    <br />
                    <small className="text-muted">Completed</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredActivities.filter(a => a.type === 'Project').length}
                    </strong>
                    <br />
                    <small className="text-muted">Projects</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredActivities.filter(a => a.isHighlighted).length}
                    </strong>
                    <br />
                    <small className="text-muted">Featured</small>
                  </Col>
                  <Col md={2}>
                    <strong>
                      {filteredActivities.reduce((total, a) => total + (a.participants ? a.participants.length : 0), 0)}
                    </strong>
                    <br />
                    <small className="text-muted">Total Participants</small>
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

export default Activities;