import {addEventMember, addEventFunctions} from './Events';

/**
 * 
 */
class Transition {
    constructor(target, cssName) {
        this.target = target;
        this.cssName = cssName;
        addEventMember(this);
    }

    play() {
        this.frame = window.requestAnimationFrame(()=>this.firstFrame());
    }

    getCSSClass(state) {
        return `animation-${this.cssName}__${state}`;
    }
    
    firstFrame() {
        const beforeStart = {
            animation:this, 
            cancel: function(){this.isCanceled = true},
            isCanceled:false
        };
        this.events.emit('beforestart', beforeStart);
        if(beforeStart.isCanceled) 
            return;
  
        this.target.classList.add(this.getCSSClass('first'), this.getCSSClass('active'));
        this.events.emit('firstframe', {animation:this});
        
        window.requestAnimationFrame(()=>this.secondFrame())
        this.finishedFunc = this.complete.bind(this);
        this.target.addEventListener('transitionend', this.finishedFunc);
        this.target.addEventListener('transitioncanceled', this.finishedFunc);  
    }

    secondFrame() {
        this.frame = 0;
        this.target.classList.remove(this.getCSSClass('first'))
        this.target.classList.add(this.getCSSClass('second'))

        this.events.emit('secondframe', {animation:this})   
    }

    complete(e) {
        if(e.target !== this.target)
            return;
            
        this.target.removeEventListener('transitionend', this.finishedFunc);
        this.target.removeEventListener('transitioncanceled', this.finishedFunc);
        this.target.classList.remove(this.getCSSClass('second'));
        this.target.classList.remove(this.getCSSClass('active'));
        this.isPlaying = false;
        this.events.emit('complete', {animation:this})
    }
}

addEventFunctions(Transition.prototype);

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