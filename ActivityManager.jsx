import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { activityAPI } from '../../services/api';

const ActivityManager = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Other',
    status: 'Planned',
    startDate: '',
    endDate: '',
    leader: '',
    isHighlighted: false,
    visibility: 'Public',
    skills: '',
    technologies: '',
    tags: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const types = ['Project', 'Competition', 'Workshop', 'Community Service', 'Research', 'Achievement', 'Other'];
  const statuses = ['Planned', 'In Progress', 'Completed', 'On Hold'];
  const visibilities = ['Public', 'Members Only', 'Private'];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getAll({ limit: 100 });
      setActivities(response.data.activities || response.data);
    } catch (error) {
      showAlert('danger', 'Failed to load activities');
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
        if (formData[key] !== '') {
          if (key === 'skills' || key === 'technologies' || key === 'tags') {
            submitData.append(key, JSON.stringify(formData[key].split(',').map(item => item.trim()).filter(item => item)));
          } else if (key === 'isHighlighted') {
            submitData.append(key, formData[key]);
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      // Append images if selected
      if (imageFiles.length > 0) {
        Array.from(imageFiles).forEach((file) => {
          submitData.append('images', file);
        });
      }

      if (editingActivity) {
        await activityAPI.update(editingActivity._id, submitData);
        showAlert('success', 'Activity updated successfully');
      } else {
        await activityAPI.create(submitData);
        showAlert('success', 'Activity created successfully');
      }

      setShowModal(false);
      setEditingActivity(null);
      resetForm();
      fetchActivities();
    } catch (error) {
      showAlert('danger', 'Failed to save activity');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'Other',
      status: 'Planned',
      startDate: '',
      endDate: '',
      leader: '',
      isHighlighted: false,
      visibility: 'Public',
      skills: '',
      technologies: '',
      tags: ''
    });
    setImageFiles([]);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      type: activity.type,
      status: activity.status,
      startDate: activity.startDate ? activity.startDate.split('T')[0] : '',
      endDate: activity.endDate ? activity.endDate.split('T')[0] : '',
      leader: activity.leader,
      isHighlighted: activity.isHighlighted,
      visibility: activity.visibility,
      skills: activity.skills ? activity.skills.join(', ') : '',
      technologies: activity.technologies ? activity.technologies.join(', ') : '',
      tags: activity.tags ? activity.tags.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityAPI.delete(id);
        showAlert('success', 'Activity deleted successfully');
        fetchActivities();
      } catch (error) {
        showAlert('danger', 'Failed to delete activity');
      }
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Planned': return 'info';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'On Hold': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading activities...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manage Activities</h4>
        <Button
          variant="primary"
          onClick={() => {
            setEditingActivity(null);
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus className="me-2" />
          Add Activity
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
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Leader</th>
                <th>Start Date</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity.title}</td>
                  <td>
                    <Badge bg="secondary">{activity.type}</Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusVariant(activity.status)}>
                      {activity.status}
                    </Badge>
                  </td>
                  <td>{activity.leader}</td>
                  <td>{new Date(activity.startDate).toLocaleDateString()}</td>
                  <td>
                    {activity.isHighlighted && (
                      <Badge bg="warning">Featured</Badge>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(activity)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(activity._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {activities.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No activities found.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingActivity ? 'Edit Activity' : 'Add New Activity'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Leader *</Form.Label>
              <Form.Control
                type="text"
                value={formData.leader}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Activity Images</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(e.target.files)}
              />
              <Form.Text className="text-muted">
                You can select multiple images (max 5)
              </Form.Text>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Visibility</Form.Label>
                  <Form.Select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  >
                    {visibilities.map(visibility => (
                      <option key={visibility} value={visibility}>{visibility}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Feature this activity"
                    checked={formData.isHighlighted}
                    onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., JavaScript, Leadership, Communication"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Technologies (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., innovation, teamwork, web development"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingActivity ? 'Update' : 'Create'} Activity
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivityManager;