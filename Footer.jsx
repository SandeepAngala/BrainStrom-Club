import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5>Brainstorm Club</h5>
            <p>
              A vibrant college club dedicated to fostering innovation, creativity, 
              and collaboration among students. Join us in building the future together.
            </p>
            <div className="d-flex gap-3">
              <a href="#" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedin size={24} />
              </a>
            </div>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/announcements">Announcements</a></li>
              <li><a href="/events">Events</a></li>
              <li><a href="/activities">Activities</a></li>
              <li><a href="/leadership">Leadership</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5>Contact Info</h5>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="me-2" />
              <span>brainstorm@college.edu</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaPhone className="me-2" />
              <span>+91 83205 52114</span>
            </div>
            <div className="d-flex align-items-center">
              <FaMapMarkerAlt className="me-2" />
              <span>Lovely Professional University ,Block 13<br />DSW<br />Phagwara - 144411, Punjab, India</span>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Brainstorm Club. All rights reserved. 
              Built with ❤️ by the Brainstorm Team.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;