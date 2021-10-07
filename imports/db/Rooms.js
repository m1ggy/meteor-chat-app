import { Mongo } from 'meteor/mongo';

const Rooms = new Mongo.Collection('rooms');
export default Rooms;
