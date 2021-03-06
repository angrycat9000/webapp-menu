import EventEmitter from 'tiny-emitter';

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
  return this.events.on.apply(this.events, arguments);
}

/**
*
*/
function off() {
  return this.events.off.apply(this.events, arguments);
}
  