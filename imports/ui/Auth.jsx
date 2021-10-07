import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';

const Auth = () => {
  const [togglePage, setTogglePage] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const user = useTracker(() => {
    return Meteor.userId();
  });

  useEffect(() => {
    if (user) history.push('/rooms');
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    Meteor.loginWithPassword(username, password, (err) => {
      if (err) setError(err.reason);
    });
  };
  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    Accounts.createUser({ username, password }, (err) => {
      if (err) setError(err.reason);
    });
  };
  return (
    <div className='wrapper'>
      {!togglePage ? (
        <Card className='cards'>
          <Card.Body>
            Login
            <Form onSubmit={handleLogin}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  type='text'
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type='password'
                />
              </Form.Group>
              <Button type='submit' variant='success'>
                Login
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer>
            <pre>
              Need an account?{' '}
              <span
                onClick={() => {
                  setTogglePage(true);
                  setPassword('');
                  setUsername('');
                  setError('');
                }}
                style={{
                  cursor: 'pointer',
                  color: 'blue',
                  textDecoration: 'underline',
                }}
              >
                Sign up.
              </span>
            </pre>
          </Card.Footer>
        </Card>
      ) : (
        <Card className='cards'>
          <Card.Body>
            Signup
            <Form onSubmit={handleSignup}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  type='text'
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  required
                />
              </Form.Group>
              <Button type='submit' variant='success'>
                Create account
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer>
            <pre>
              Already have an account?{' '}
              <span
                onClick={() => {
                  setTogglePage(false);
                  setPassword('');
                  setUsername('');
                  setError('');
                }}
                style={{
                  cursor: 'pointer',
                  color: 'blue',
                  textDecoration: 'underline',
                }}
              >
                Sign in.
              </span>
            </pre>
          </Card.Footer>
        </Card>
      )}

      {error && (
        <Alert variant='danger' className='m-2'>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default Auth;
