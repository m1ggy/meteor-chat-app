import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
const ProfileDetails = ({ ...props }) => {
  const user = useTracker(() => Meteor.user());

  console.log(user);
  return (
    <div {...props}>
      <h2>Profile Details</h2>

      {user && (
        <div style={{ textAlign: 'center' }}>
          <h6>Details</h6>
          <pre>username:{user.username}</pre>
          <pre>id:{user._id}</pre>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
