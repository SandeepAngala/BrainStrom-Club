import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAlertType('success');
      setShowAlert(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Header Section */}
      <section className="bg-light py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1 className="text-gradient mb-3">Contact Us</h1>
              <p className="lead">
                Get in touch with Brainstorm Club. We'd love to hear from you!
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {showAlert && (
          <Alert variant={alertType} className="mb-4">
            {alertType === 'success' 
              ? 'Thank you for your message! We\'ll get back to you soon.' 
              : 'Sorry, there was an error sending your message. Please try again.'}
          </Alert>
        )}

        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-5">
            <Card className="slide-up">
              <Card.Header>
                <h4 className="mb-0">Send us a Message</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Subject *</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this message about?"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry, suggestions, or how you'd like to get involved..."
                    />
                  </Form.Group>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col lg={4}>
            <Card className="slide-up mb-4">
              <Card.Header>
                <h5 className="mb-0">Contact Information</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaEnvelope className="me-3 text-primary" size={20} />
                  <div>
                    <strong>Email</strong>
                    <br />
                    <a href="mailto:himanshukumarsingh454@gmail.com">himanshukumarsingh454@gmail.com</a>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <FaPhone className="me-3 text-success" size={20} />
                  <div>
                    <strong>Phone</strong>
                    <br />
                    <a href="tel:+918320552114">+91 83205 52114</a>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <FaMapMarkerAlt className="me-3 text-danger" size={20} />
                  <div>
                    <strong>Location</strong>
                    <br />
                    Lovely Professional University ,Block 13<br />
                    DSW<br />
                    Phagwara - 144411, Punjab, India
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <FaClock className="me-3 text-warning" size={20} />
                  <div>
                    <strong>Office Hours</strong>
                    <br />
                    Monday - Friday<br />
                    2:00 PM - 6:00 PM
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Social Media */}
            <Card className="slide-up mb-4">
              <Card.Header>
                <h5 className="mb-0">Follow Us</h5>
              </Card.Header>
              <Card.Body>
                <p>Stay connected with us on social media for the latest updates!</p>
                <div className="d-flex gap-3">
                  <a href="#" className="text-primary" aria-label="Facebook">
                    <FaFacebook size={24} />
                  </a>
                  <a href="#" className="text-info" aria-label="Twitter">
                    <FaTwitter size={24} />
                  </a>
                  <a href="#" className="text-danger" aria-label="Instagram">
                    <FaInstagram size={24} />
                  </a>
                  <a href="#" className="text-primary" aria-label="LinkedIn">
                    <FaLinkedin size={24} />
                  </a>
                </div>
              </Card.Body>
            </Card>

            {/* Meeting Times */}
            <Card className="slide-up">
              <Card.Header>
                <h5 className="mb-0">Club Meetings</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <strong>General Meetings</strong>
                  <br />
                  <span className="text-muted">Every Tuesday, 7:00 PM</span>
                </div>
                <div className="mb-3">
                  <strong>Project Sessions</strong>
                  <br />
                  <span className="text-muted">Thursdays & Saturdays, 3:00 PM</span>
                </div>
                <div>
                  <strong>Workshop Days</strong>
                  <br />
                  <span className="text-muted">Fridays, 4:00 PM</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mt-5">
          <Col>
            <Card className="slide-up">
              <Card.Header>
                <h4 className="mb-0">Frequently Asked Questions</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-4">
                      <h6>How can I join Brainstorm Club?</h6>
                      <p className="text-muted">
                        Anyone can join! Just attend one of our general meetings or contact us 
                        through this form. We welcome students from all departments and years.
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h6>Are there any membership fees?</h6>
                      <p className="text-muted">
                        No, membership in Brainstorm Club is completely free. We believe in 
                        making our community accessible to everyone.
                      </p>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="mb-4">
                      <h6>What kind of activities do you organize?</h6>
                      <p className="text-muted">
                        We organize workshops, hackathons, project collaborations, guest lectures, 
                        networking events, and community service projects.
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h6>Can I propose a project or event?</h6>
                      <p className="text-muted">
                        Absolutely! We encourage member initiatives. Share your ideas during 
                        meetings or contact our project coordinators.
                      </p>
                    </div>
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

export default Contact;