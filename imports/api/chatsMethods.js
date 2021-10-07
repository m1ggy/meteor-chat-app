import { Meteor } from 'meteor/meteor';
import Chats from '../db/Chats';

Meteor.methods({
  'chats.insert'(roomId, chat) {
    if (!this.userId) throw new Meteor.Error('unauthorized', 'Not authorized');

    const user = Meteor.user();

    Chats.insert({
      roomId,
      text: chat,
      createdAt: new Date(),
      sender: user.username,
      senderId: this.userId,
    });
  },
});
