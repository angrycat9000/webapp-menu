/**
 * @author Mark Dane
 */
import {addEventMember, addEventFunctions} from './Events';

/**
 * @typedef TransitionEvent
 * @property {Transition} animation transition that generated this event
 * @property {Boolean} isFastForward 
 * @property {function} cancel
 */
function transitionEvent(transition) {
    return  {
        transition, 
        isFastForward:false,
    };
}

/**
 * Aid in transitioning elements between states using CSS transitions.  
 * * Requests animations frames and handles subscriptions to transition events.
 * * Manages adding and removing CSS classes at different points in transition.
 * * Provides callbacks for attributes that can't set in stylesheets beforehand.
 */
class Transition {
    constructor(target, cssName) {
        this.target = target;
        this.cssName = cssName;
        this.startFunc = null;
        this.finishedFunc = null;
        this._abort = false;
        addEventMember(this);
    
        /** 
         * Ignore any transitions that occur on children if true.  
         * @property {boolean} ignoreChildren 
         */
        this.ignoreChildren = true;
    }

    /**
     * Start the transition on the next animation frame
     */
    play() {
        this._abort = false;
        this.frame = window.requestAnimationFrame((e)=>this.firstFrame(e));
    }

    /**
     * Execute the all actions associated with the transition in the next animation frame  
     * Useful if you don't want an animation to appear, but still want all the side effects
     * of the event listeners to happen
     */
    fastForward() {
        this.frame = window.requestAnimationFrame(()=>this.immediate());
    }

    /**
     * Execute all the frame events immediately.  Does not wait for an animation frame.
     */
    immediate() {
        this.frame = 0;
        const event = transitionEvent(this);
        event.isFastForward = true;

        this.events.emit('firstframe', event);
        if(this.wasStopped)
            return;

        this.events.emit('secondframe', event);
        if(this.wasStopped)
            return;

        this.events.emit('complete', event);
    }

    /**
     * Cancels the transition
     */
    stop() {
        this._abort = true;
        this.cleanup();
        this.events.emit('stopped', event);
    }

    /** @property {Boolean} wasStopped true of stop() was called */
    get wasStopped() {return this._abort;}

    cleanup() {
        if(this.frame) {
            window.cancelAnimationFrame(this.frame);
            this.frame = 0;
        }
        if(this.startFunc) {
            this.target.removeEventListener('transtionstart', this.startFunc)
            this.startFunc = null;
        }
        if(this.finishedFunc) {
            this.target.removeEventListener('transitionend', this.finishedFunc);
            this.target.removeEventListener('transitioncanceled', this.finishedFunc);
            this.finishedFunc = null;
        }
        this.target.classList.remove(this.getCSSClass('first'), this.getCSSClass('second'), this.getCSSClass('active'));
    }

    getCSSClass(state) {
        return `${this.cssName}__${state}`;
    }
    
    firstFrame() {
        this.frame = 0;
        this.transitionStarted = false;
        this.startFunc = (e)=>{
            if(e.target === this.target ||  ! this.ignoreChildren)
                this.transitionStarted = true;
        }
        this.target.addEventListener('transitionstart', this.startFunc);

        this.target.classList.add(this.getCSSClass('first'), this.getCSSClass('active'));
        this.events.emit('firstframe', transitionEvent(this));

        if(this.wasStopped)
            return;
        
        this.frame = window.requestAnimationFrame(()=>this.secondFrame());
    }

    secondFrame() {
        this.frame = 0;
        this.target.classList.remove(this.getCSSClass('first'))
        this.target.classList.add(this.getCSSClass('second'))
        this.events.emit('secondframe', transitionEvent(this));
        if(this.wasStopped)
            return;

        this.finishedFunc = this.complete.bind(this);
        this.target.addEventListener('transitionend', this.finishedFunc);
        this.target.addEventListener('transitioncanceled',this);
        this.frame = window.requestAnimationFrame(()=>this.thirdFrame())
    }

    // Not needed for animation. Used to check if a transition has really started. Bails out
    // if it hasn't taken place
    thirdFrame() {
        this.frame = 0;
        this.target.removeEventListener('transtionstart', this.startFunc)
        this.startFunc = null;

        if( ! this.transitionStarted) {
            console.warn('Transition failed to start for: ', this.cssName, this.target);
            this.cleanup();
            this.events.emit('complete', transitionEvent(this));
        }
    }

    complete(e) {
        if(e.target !== this.target)
            return;
        
        this.cleanup();
        this.events.emit('complete', transitionEvent(this));
    }
}

addEventFunctions(Transition.prototype);

/**
 * First animation frame after .play() or .fastForward() was called.
 * @event Transition#firstframe
 * @type {TransitionEvent}
 */

/**
 * Second animation frame after .play().
 * @event Transition#secondframe
 * @type {TransitionEvent}
 */

/**
 * The stop() method was called to halt the transition.
 * @event Transition#stopped
 * @type {TransitionEvent}
 */

/**
 * After transition has finished.  Does not occur if stop() was called.
 * @event Transition#complete
 * @type {TransitionEvent}
 */


/**
 * 
 */
class Exit extends Transition {
    constructor(target) {
        super(target, 'exit');
        this.on('complete', this.removeOnComplete, this);
    }

    removeOnComplete(e) {
        if(this.target.parentElement)
            this.target.parentElement.removeChild(this.target);
    }
}

/**
 * 
 */
class Enter extends Transition {
    constructor(target, host, cssName='enter') {
        if( ! (host instanceof HTMLElement))
            throw new Error('Must provide an HTMLElement for the target to be added.');

        super(target, cssName);
        this.host = host;
        this.on('firstframe', this.addTarget, this);
    }

    addTarget() {
        this.host.appendChild(this.target);
    }
}

var Animation = {
    Transition,
    Enter,
    Exit
}

export default Animation;