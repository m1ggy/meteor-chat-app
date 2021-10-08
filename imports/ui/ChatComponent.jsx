import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

const ChatComponent = ({ chats }) => {
  const [message, setMessage] = useState('');

  const user = useTracker(() => Meteor.userId());
  const scrollRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();

    Meteor.call('chats.insert', Session.get('currentRoomId'), message);
    setMessage('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats]);

  return (
    <div>
      <Col>
        <Row className='border m-2'>
          <div className='chats-container'>
            {chats &&
              chats.map((x) => {
                return (
                  <div
                    className={`${x.senderId === user && 'chat-right'}`}
                    key={x._id}
                    style={{ marginTop: '10px' }}
                  >
                    <pre
                      style={{
                        margin: 0,
                        textAlign: 'center',
                        // border: '1px black solid',
                        maxWidth: '150px',
                      }}
                    >
                      {x.senderId === user ? 'me' : x.sender}
                      {`, `}
                      {x.createdAt.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      <br />
                      {x.senderId}
                    </pre>
                    <div className={`chat `}>{x.text}</div>
                  </div>
                );
              })}

            <div ref={scrollRef} />
          </div>
        </Row>
        <Row className='m-3'>
          <Form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Form.Group>
              {/* <Form.FloatingLabel>Message</Form.FloatingLabel> */}
              <Form.Control
                required
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ minWidth: '45vw' }}
              />
            </Form.Group>
            <Button
              type='submit'
              variant='outline-primary'
              style={{
                width: 'fit-content',
                height: 'max-content',
                marginLeft: 5,
              }}
            >
              Send
            </Button>
          </Form>
        </Row>
      </Col>
    </div>
  );
};

export default ChatComponent;
