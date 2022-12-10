function getString(element, attributeName, defaultValue) {
  if (!element.hasAttribute(attributeName)) return defaultValue;
  return element.getAttribute(attributeName);
}

function setString(element, attributeName, value, defaultValue) {
  if (value && value !== defaultValue) {
    element.setAttribute(attributeName, value);
  } else {
    element.removeAttribute(attributeName);
  }
  return value;
}

function getBoolean(element, attributeName) {
  return element.hasAttribute(attributeName);
}
function setBoolean(element, attributeName, value) {
  if (value) element.setAttribute(attributeName, "");
  else element.removeAttribute(attributeName);
}

var Attributes = {
  getString,
  setString,
  getBoolean,
  setBoolean
};

export default Attributes;
