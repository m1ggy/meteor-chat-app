import { Meteor } from 'meteor/meteor';
import Chats from '../db/Chats';
import Rooms from '../db/Rooms';

Meteor.methods({
  'rooms.insert'(roomName) {
    if (!this.userId) throw new Meteor.Error('unauthorized', 'Not authorized');
    Rooms.insert({ name: roomName, creatorId: this.userId });
  },
  'rooms.remove'(creatorId, roomId) {
    if (!this.userId) throw new Meteor.Error('unauthorized', 'Not authorized');

    Rooms.remove({ _id: roomId, creatorId });
    Chats.remove({ roomId });
  },
  'rooms.leave'(roomId) {
    if (!this.userId) throw new Meteor.Error('unauthorized', 'Not authorized');

    const roomToLeave = Rooms.findOne(roomId);

    ///if user is the creator of this room, delete the room.
    if (roomToLeave.creatorId === this.userId) {
      Chats.remove({ roomId });
      Rooms.remove({ _id: roomId, creatorId: this.userId });
    } else {
      Rooms.update({ _id: roomId }, { $pull: { members: this.userId } });
    }
  },
  'rooms.rename'(creatorId, newName, roomId) {
    if (!this.userId) throw new Meteor.Error('unauthorized', 'Not authorized');

    Rooms.update({ _id: roomId, creatorId }, { name: newName });
  },

  'rooms.join'(roomId) {
    if (!this.userId) throw new Meteor.Error('unauthorized', 'Not authorized');

    const currentRoom = Rooms.findOne(roomId);

    if (currentRoom) {
      if (currentRoom.creatorId === this.userId) {
        throw new Meteor.Error(
          'user-is-creator',
          'User cannot join owned rooms.'
        );
      }
      if (currentRoom.members) {
        currentRoom.members.forEach((x) => {
          if (x === this.userId) {
            throw new Meteor.Error(
              'user-is-joined-already',
              'You are already in this room.'
            );
          }
        });
      }
      if (currentRoom.recipient) {
        throw new Meteor.Error('private', 'this room is private');
      }
      Rooms.update(
        roomId,
        { $push: { members: this.userId } },
        { upsert: true }
      );
      return;
    }

    throw new Meteor.Error('room-does-not-exist', 'Room does not exist');
  },

  'rooms.direct'(recipientId, chat) {
    if (!this.userId) throw new Meteor.Error('unauthorized', 'Not authorized');

    const recipient = Meteor.users.findOne(recipientId);
    const user = Meteor.user();

    const rooms = Rooms.find({});

    rooms.forEach((x) => {
      if (
        (x.creatorId === this.userId && x.recipientId === recipientId) ||
        (x.creatorId === recipientId && x.recipientId === this.userId)
      ) {
        console.log(x);
        throw new Meteor.Error(
          'room-already-exists',
          'You already have a room with this user'
        );
      }
    });

    Rooms.insert(
      {
        creatorId: this.userId,
        recipientId: recipient._id,
        sender: user.username,
        recipient: recipient.username,
      },
      (err, id) => {
        if (err) throw new Meteor.Error('error', 'failed to insert room');
        Chats.insert({
          text: chat,
          senderId: this.userId,
          sender: user.username,
          createdAt: new Date(),
          recipientId: recipient._id,
          recipient: recipient.username,
          roomId: id,
        });
      }
    );
  },
  'users.find'(id) {
    if (!this.userId) throw new Meteor.Error('unauthorized', 'Not authorized');

    const recipient = Meteor.users.findOne(id);

    if (!recipient)
      throw new Meteor.Error('user-not-found', 'Cannot find user');

    if (recipient._id === this.userId)
      throw new Meteor.Error(
        'user-is-recipient',
        'Cannot send a message to own user'
      );

    if (recipient) return true;
  },
});
