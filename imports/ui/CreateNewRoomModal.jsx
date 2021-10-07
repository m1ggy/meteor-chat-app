import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
const CreateNewRoomModal = ({ show, setShow }) => {
  const handleClose = () => setShow(false);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    Meteor.call('rooms.insert', name);
    setName('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Room Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              required
            />
          </Form.Group>
          <Button type='submit'>Submit</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateNewRoomModal;
