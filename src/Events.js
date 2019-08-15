var EventEmitter = require('EventEmitter').default;

/**
*
*/
export function addEventMember(object) {
  object.events = new EventEmitter();
}

/**
*
*/
export function addEventFunctions(proto) {
  proto.on = on;
  proto.off = off;
}

/**
*
*/
function on() {
  this.events.on.apply(this.events, arguments);
}

/**
*
*/
function off() {
  this.events.off.apply(this.events, arguments);
}
  