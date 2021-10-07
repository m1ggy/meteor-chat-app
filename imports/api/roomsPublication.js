import { Meteor } from 'meteor/meteor';
import Rooms from '../db/Rooms';

Meteor.publish('rooms', function () {
  if (!this.userId) return [];

  return Rooms.find();
});
