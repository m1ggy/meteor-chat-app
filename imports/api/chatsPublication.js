import { Meteor } from 'meteor/meteor';
import Chats from '../db/Chats';

Meteor.publish('chats', function () {
  if (!this.userId) return [];

  return Chats.find({});
});
