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
        this.frame = window.requestAnimationFrame(()=>this.firstFrame());
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
        this._timeout = 0;
        const event = transitionEvent(this);
        event.isFastForward = true;

        this.events.emit('firstframe', event);
        this.events.emit('secondframe', event);
        this.events.emit('complete', event);
    }

    cleanup() {
        if(this.frame) {
            window.cancelAnimationFrame(this.frame);
            this.frame = 0;
        }
        if(this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = 0;
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

        this.finishedFunc = this.complete.bind(this);
        this.target.addEventListener('transitionend', this.finishedFunc);
        this.target.addEventListener('transitioncanceled',this.finishedFunc);

        this.target.classList.add(this.getCSSClass('first'), this.getCSSClass('active'));
        this.events.emit('firstframe', transitionEvent(this));

        if( ! this.wasStopped)
            this.frame = window.requestAnimationFrame(()=>this.secondFrame());
    }

    secondFrame() {
        this.frame = 0;
        this.target.classList.remove(this.getCSSClass('first'))
        this.target.classList.add(this.getCSSClass('second'))
        this.events.emit('secondframe', transitionEvent(this));

        if( ! this.wasStopped)
            this.timeout = window.setTimeout(this.checkOnTransition.bind(this), 50);
    }

    /*  Check if the transition has really started after 50 ms.  If it hasn't started
        there was a problem with the setup and it will never start. */
    checkOnTransition() {
        this.timeout = 0;
        if( ! this.transitionStarted) {
            console.warn('Transition failed to start for: ', this.cssName, this.target);
            this.cleanup();
            this.events.emit('complete', transitionEvent(this));
        }
    }

    complete(e) {
        if(this.ignoreChildren && e.target !== this.target)
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