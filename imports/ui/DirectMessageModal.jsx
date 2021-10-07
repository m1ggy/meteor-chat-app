import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
const DirectMessageModal = ({ show, setShow }) => {
  const handleClose = () => setShow(false);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>Direct Message</Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.FloatingLabel></Form.FloatingLabel>
            <Form.Control
              type='text'
              value={recipientId}
              onChange={(e) => findUser(e)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DirectMessageModal;
