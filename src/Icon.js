import backSvgIcon from '../icons/back.svg';
import nestedSvgIcon from '../icons/nested.svg';


function svgIconFromString(text) {
    const div = document.createElement('div');
    div.innerHTML = text;
    div.firstElementChild.setAttribute('aria-hidden', 'true')
    return div.firstElementChild;
}

const Icon = {};

Object.defineProperty(Icon, 'Back', {get:()=>svgIconFromString(backSvgIcon)} )
Object.defineProperty(Icon, 'Nested', {get:()=>svgIconFromString(nestedSvgIcon)});

export default Icon;