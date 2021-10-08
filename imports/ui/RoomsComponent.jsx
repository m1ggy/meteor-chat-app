import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Col, Row } from 'react-bootstrap';
import { Session } from 'meteor/session';
import { useHistory } from 'react-router';
import Rooms from '../db/Rooms';
import CreateNewRoomModal from './CreateNewRoomModal';
import JoinRoomModal from './JoinRoomModal';
import ChatComponent from './ChatComponent';
import Chats from '../db/Chats';
import ProfileDetails from './ProfileDetails';
import DirectMessageModal from './DirectMessageModal';

const RoomsComponent = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const history = useHistory();
  const user = useTracker(() => Meteor.userId());

  const { rooms, loading, selectedRoom } = useTracker(() => {
    const handle = Meteor.subscribe('rooms');

    if (!handle.ready()) return { rooms: [], loading: true };

    let rooms = Rooms.find({}).fetch();

    rooms = rooms.filter((x) => {
      return (
        x.creatorId === user ||
        (x.members && x?.members.includes(user)) ||
        x.recipient === Meteor.user().username ||
        x.sender === Meteor.user().username
      );
    });
    const selectedRoomId = Session.get('currentRoomId');

    if (selectedRoomId == null) {
      return { rooms, loading: false };
    }

    if (rooms.length && selectedRoomId == null)
      Session.set('currentRoomId', rooms[0]._id);

    const selectedRoom = Rooms.findOne({
      _id: selectedRoomId,
    });

    return { rooms, loading: false, selectedRoom };
  });

  let { chats } = useTracker(() => {
    const handle = Meteor.subscribe('chats');
    const roomId = Session.get('currentRoomId');

    if (!handle.ready()) return { chats: [] };

    if (roomId == null) return { chats: [] };

    const chats = Chats.find({ roomId }, { sort: { createdAt: 1 } }).fetch();

    return { chats };
  });

  useEffect(() => {
    if (!user) history.push('/');
  });

  const handleSelectRoom = (id) => {
    Session.set('currentRoomId', id);
  };

  const handleLeave = (roomId) => {
    Meteor.call('rooms.leave', roomId);
    Session.set('currentRoomId', null);
  };

  return (
    <div>
      <Col>
        <Row>
          <div
            className='border'
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              onClick={() => {
                Session.set('currentRoomId', null);
                Meteor.logout();
              }}
              variant='danger'
              style={{ width: 'fit-content' }}
            >
              Sign out
            </Button>
          </div>
        </Row>
        <Row>
          <Col
            lg={3}
            style={{ overflowY: 'scroll' }}
            md={3}
            sm={12}
            className='border'
          >
            <Button variant='primary' onClick={() => setShowSend(true)}>
              Send Message
            </Button>
            <Button
              variant='outline-success'
              onClick={() => setShowCreate(true)}
            >
              Create New Room
            </Button>
            <Button variant='outline-primary' onClick={() => setShowJoin(true)}>
              Join Room
            </Button>
            <h2>Chats</h2>
            <ul>
              {loading && <pre>Loading Rooms ...</pre>}

              {rooms &&
                rooms.map((x) => {
                  return (
                    <li
                      key={x._id}
                      style={{
                        cursor: 'pointer',
                        backgroundColor:
                          x._id === (selectedRoom && selectedRoom._id) &&
                          'beige',
                        listStyleType: 'none',
                        textAlign: 'center',
                        minHeight: '50px',
                      }}
                      onClick={() => handleSelectRoom(x._id)}
                    >
                      {x.name ||
                        (x.creatorId === user && x.recipient && x.recipient) ||
                        (x.recipientId === user && x.sender && x.sender)}
                    </li>
                  );
                })}

              {!rooms.length ? <pre>No rooms yet.</pre> : null}
            </ul>
          </Col>
          <Col className='border'>
            {selectedRoom && (
              <>
                <h2>
                  {selectedRoom.name ||
                    (selectedRoom.creatorId === user &&
                      selectedRoom.recipient &&
                      selectedRoom.recipient) ||
                    (selectedRoom.recipientId === user &&
                      selectedRoom.sender &&
                      selectedRoom.sender)}
                </h2>
                <Button
                  onClick={() => handleLeave(selectedRoom._id)}
                  variant='outline-danger'
                >
                  Leave Room
                </Button>
                <p>room info</p>
                <pre>creatorId: {selectedRoom.creatorId}</pre>

                <pre>
                  ID:{selectedRoom._id}{' '}
                  <span
                    onClick={async () =>
                      await navigator.clipboard.writeText(selectedRoom._id)
                    }
                    style={{
                      textDecoration: 'underline',
                      color: 'blue',
                      cursor: 'pointer',
                    }}
                  >
                    copy
                  </span>
                </pre>
                {selectedRoom?.members && (
                  <pre>
                    Members:
                    {selectedRoom.members.map((x) => {
                      return <>{x},</>;
                    })}
                  </pre>
                )}
                {selectedRoom.sender && selectedRoom.recipient && (
                  <pre>
                    sender:{selectedRoom.sender}
                    <br />
                    recipient:
                    {selectedRoom.recipient}
                  </pre>
                )}
                <ChatComponent chats={chats} loading={loading} />
              </>
            )}
          </Col>
          <Col lg={3} className='border'>
            <ProfileDetails />
          </Col>
          <CreateNewRoomModal setShow={setShowCreate} show={showCreate} />
          <JoinRoomModal show={showJoin} setShow={setShowJoin} />
          <DirectMessageModal show={showSend} setShow={setShowSend} />
        </Row>
      </Col>
    </div>
  );
};

export default RoomsComponent;
