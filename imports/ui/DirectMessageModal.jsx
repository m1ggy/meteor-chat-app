import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
const DirectMessageModal = ({ show, setShow }) => {
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [validUser, setValidUser] = useState(false);
  const [error, setError] = useState(null);
  const handleClose = () => {
    setRecipientId('');
    setMessage('');
    setShow(false);
  };

  useEffect(() => {
    setError(null);
    if (recipientId.length) {
      Meteor.call('users.find', recipientId, (err, result) => {
        if (err) return setError(err.reason);
        setValidUser(result);
      });
    }
  }, [recipientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    Meteor.call('rooms.direct', recipientId, message, (err) => {
      if (err) {
        return setError(err.reason);
      } else {
        setShow(false);
        setMessage('');
        setRecipientId('');
      }
    });
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>Direct Message</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
          <Form.Group>
            <Form.FloatingLabel>Recipient ID</Form.FloatingLabel>
            <Form.Control
              type='text'
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              required
            />

            <Form.Control.Feedback>
              {validUser ? 'user exists' : 'no user found'}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.FloatingLabel>Message</Form.FloatingLabel>
            <Form.Control
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>
          <Button
            disabled={!validUser}
            variant='outline-success'
            type='submit'
            className='button'
          >
            Submit
          </Button>
        </Form>
        {error && <Alert variant='danger'>{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} variant='outline-close'>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DirectMessageModal;
