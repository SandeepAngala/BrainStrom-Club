import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { leadershipAPI } from '../../services/api';

const LeadershipManager = () => {
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: 'Other',
    department: '',
    email: '',
    phone: '',
    bio: '',
    officeLocation: '',
    officeHours: '',
    displayOrder: '',
    isActive: true,
    expertise: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      website: ''
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const positions = ['Chancellor', 'Vice Chancellor', 'HOD', 'Club President', 'Vice President', 'Secretary', 'Treasurer', 'Technical Lead', 'Event Coordinator', 'Other'];

  useEffect(() => {
    fetchLeadership();
  }, []);

  const fetchLeadership = async () => {
    try {
      setLoading(true);
      const response = await leadershipAPI.getAll();
      setLeadership(response.data);
    } catch (error) {
      showAlert('danger', 'Failed to load leadership members');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'socialLinks') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'expertise') {
          submitData.append(key, JSON.stringify(formData[key].split(',').map(item => item.trim()).filter(item => item)));
        } else if (key === 'isActive') {
          submitData.append(key, formData[key]);
        } else if (formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      // Append image if selected
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editingLeader) {
        await leadershipAPI.update(editingLeader._id, submitData);
        showAlert('success', 'Leadership member updated successfully');
      } else {
        await leadershipAPI.create(submitData);
        showAlert('success', 'Leadership member created successfully');
      }

      setShowModal(false);
      setEditingLeader(null);
      resetForm();
      fetchLeadership();
    } catch (error) {
      showAlert('danger', 'Failed to save leadership member');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: 'Other',
      department: '',
      email: '',
      phone: '',
      bio: '',
      officeLocation: '',
      officeHours: '',
      displayOrder: '',
      isActive: true,
      expertise: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      }
    });
    setImageFile(null);
  };

  const handleEdit = (leader) => {
    setEditingLeader(leader);
    setFormData({
      name: leader.name,
      position: leader.position,
      department: leader.department,
      email: leader.email,
      phone: leader.phone || '',
      bio: leader.bio || '',
      officeLocation: leader.officeLocation || '',
      officeHours: leader.officeHours || '',
      displayOrder: leader.displayOrder || '',
      isActive: leader.isActive,
      expertise: leader.expertise ? leader.expertise.join(', ') : '',
      socialLinks: leader.socialLinks || {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leadership member?')) {
      try {
        await leadershipAPI.delete(id);
        showAlert('success', 'Leadership member deleted successfully');
        fetchLeadership();
      } catch (error) {
        showAlert('danger', 'Failed to delete leadership member');
      }
    }
  };

  const getPositionVariant = (position) => {
    switch (position) {
      case 'Chancellor': return 'primary';
      case 'Vice Chancellor': return 'secondary';
      case 'HOD': return 'success';
      case 'Club President': return 'info';
      case 'Vice President': return 'warning';
      default: return 'light';
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading leadership members...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manage Leadership</h4>
        <Button
          variant="primary"
          onClick={() => {
            setEditingLeader(null);
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus className="me-2" />
          Add Leadership Member
        </Button>
      </div>

      {alert.show && (
        <Alert variant={alert.type} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Table responsive striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leadership.map((leader) => (
                <tr key={leader._id}>
                  <td>{leader.name}</td>
                  <td>
                    <Badge bg={getPositionVariant(leader.position)}>
                      {leader.position}
                    </Badge>
                  </td>
                  <td>{leader.department}</td>
                  <td>{leader.email}</td>
                  <td>
                    <Badge bg={leader.isActive ? 'success' : 'secondary'}>
                      {leader.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(leader)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(leader._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {leadership.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No leadership members found.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingLeader ? 'Edit Leadership Member' : 'Add New Leadership Member'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Position *</Form.Label>
                  <Form.Select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  >
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Department *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief biography and background"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Office Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.officeLocation}
                    onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                    placeholder="e.g., Room 205, Student Center"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Office Hours</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.officeHours}
                    onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                    placeholder="e.g., Mon-Fri 2-4 PM"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    placeholder="Lower numbers appear first"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Active Member"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Expertise (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                placeholder="e.g., Leadership, Technology, Research"
              />
            </Form.Group>

            <h6>Social Links</h6>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                    })}
                    placeholder="https://twitter.com/username"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>GitHub</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, github: e.target.value }
                    })}
                    placeholder="https://github.com/username"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.socialLinks.website}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, website: e.target.value }
                    })}
                    placeholder="https://yourwebsite.com"
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingLeader ? 'Update' : 'Create'} Leadership Member
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadershipManager;