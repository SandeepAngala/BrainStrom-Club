import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaBullhorn, FaCalendarAlt, FaTasks, FaUsers } from 'react-icons/fa';
import { announcementAPI, eventAPI, activityAPI, leadershipAPI } from '../../services/api';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    announcements: 0,
    events: 0,
    activities: 0,
    leadership: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [announcements, events, activities, leadership] = await Promise.all([
        announcementAPI.getAll({ limit: 1000 }),
        eventAPI.getAll({ limit: 1000 }),
        activityAPI.getAll({ limit: 1000 }),
        leadershipAPI.getAll()
      ]);

      setStats({
        announcements: announcements.data.total || announcements.data.length || 0,
        events: events.data.total || events.data.length || 0,
        activities: activities.data.total || activities.data.length || 0,
        leadership: leadership.data.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">Dashboard Overview</h4>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="bg-primary text-white">
            <Card.Body className="text-center">
              <FaBullhorn size={48} className="mb-3" />
              <h3>{stats.announcements}</h3>
              <p className="mb-0">Total Announcements</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="bg-success text-white">
            <Card.Body className="text-center">
              <FaCalendarAlt size={48} className="mb-3" />
              <h3>{stats.events}</h3>
              <p className="mb-0">Total Events</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="bg-warning text-white">
            <Card.Body className="text-center">
              <FaTasks size={48} className="mb-3" />
              <h3>{stats.activities}</h3>
              <p className="mb-0">Total Activities</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="bg-info text-white">
            <Card.Body className="text-center">
              <FaUsers size={48} className="mb-3" />
              <h3>{stats.leadership}</h3>
              <p className="mb-0">Leadership Members</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <p>Welcome to the Brainstorm Club admin dashboard! From here you can:</p>
              <ul>
                <li>Create and manage announcements to keep members informed</li>
                <li>Schedule and organize club events</li>
                <li>Showcase club activities and projects</li>
                <li>Update leadership information and profiles</li>
              </ul>
              <p className="mb-0">
                Use the navigation tabs on the left to access different management sections.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStats;