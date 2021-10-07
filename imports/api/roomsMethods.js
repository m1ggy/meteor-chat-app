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

    Rooms.insert({ creatorId: this.userId, recipient });
    Chats.insert({
      text: chat,
      senderId: this.userId,
      sender: user.username,
      createdAt: new Date(),
      recipient,
    });
  },
});
