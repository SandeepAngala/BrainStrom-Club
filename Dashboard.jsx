import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FaUsers, FaBullhorn, FaCalendarAlt, FaTasks, FaChartBar } from 'react-icons/fa';

// Import dashboard components (we'll create these)
import AnnouncementManager from '../components/dashboard/AnnouncementManager';
import EventManager from '../components/dashboard/EventManager';
import ActivityManager from '../components/dashboard/ActivityManager';
import LeadershipManager from '../components/dashboard/LeadershipManager';
import DashboardStats from '../components/dashboard/DashboardStats';

const Dashboard = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Access Denied</h4>
          <p>You don't have permission to access the admin dashboard.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="fade-in">
      <Container fluid className="py-4">
        <Row>
          <Col>
            <h2 className="text-gradient mb-4">Admin Dashboard</h2>
            <p className="lead mb-4">
              Welcome back, {user?.firstName}! Manage your club's content and activities.
            </p>
          </Col>
        </Row>

        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Row>
            <Col lg={2} className="mb-4">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="stats">
                    <FaChartBar className="me-2" />
                    Overview
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="announcements">
                    <FaBullhorn className="me-2" />
                    Announcements
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="events">
                    <FaCalendarAlt className="me-2" />
                    Events
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="activities">
                    <FaTasks className="me-2" />
                    Activities
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="leadership">
                    <FaUsers className="me-2" />
                    Leadership
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col lg={10}>
              <Tab.Content>
                <Tab.Pane eventKey="stats">
                  <DashboardStats />
                </Tab.Pane>
                <Tab.Pane eventKey="announcements">
                  <AnnouncementManager />
                </Tab.Pane>
                <Tab.Pane eventKey="events">
                  <EventManager />
                </Tab.Pane>
                <Tab.Pane eventKey="activities">
                  <ActivityManager />
                </Tab.Pane>
                <Tab.Pane eventKey="leadership">
                  <LeadershipManager />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default Dashboard;