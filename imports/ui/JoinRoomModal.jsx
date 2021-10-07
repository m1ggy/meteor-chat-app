import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
const JoinRoomModal = ({ show, setShow }) => {
  const handleClose = () => setShow(false);
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    Meteor.call('rooms.join', roomId, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        handleClose();
      }
      setRoomId('');
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Join Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Room Id</Form.Label>
            <Form.Control
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              type='text'
              required
            />
          </Form.Group>
          <Button type='submit'>Submit</Button>
        </Form>

        {error && <Alert>{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JoinRoomModal;
