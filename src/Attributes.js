function getTrueFalse(element, attributeName, defaultValue) {
    if( ! element.hasAttribute(attributeName))
        return defaultValue;

    const value = element.getAttribute(attributeName);
    if(value == 'false' || value == 'no')
        return false;
    if(value == 'true' || value == 'yes')
        return true;

    return defaultValue;
}

function setTrueFalse(element, attributeName, value) {
    const boolValue = ('yes' == value || 'true' == value) ? true : Boolean(value);
    element.setAttribute(attributeName, boolValue);
    return boolValue;
}

function getString(element, attributeName, defaultValue) {
    if( ! element.hasAttribute(attributeName))
        return defaultValue;
    return element.getAttribute(attributeName);
}

function setString(element, attributeName, value) {
    if(value)
        element.setAttribute(attributeName, value);
    else
        element.removeAttribute(attributeName);
    return value;
}

function getExists(element, attributeName) {
    return element.hasAttribute(attributeName);
}
function setExists(element, attributeName, value) {
    if(value)
        element.setAttribute(attributeName, '');
    else
        element.removeAttribute('open');
}

var Attributes = {
    getString,
    setString,
    getTrueFalse,
    setTrueFalse,
    getExists,
    setExists
};

export default Attributes;