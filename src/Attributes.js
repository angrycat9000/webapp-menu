function getTrueFalse(element, attributeName) {
  if (!element.hasAttribute(attributeName)) {
    return false;
  }

  const value = element.getAttribute(attributeName);
  if (value === "false" || value === "no") {
    return false;
  }

  return true;
}

function setTrueFalse(element, attributeName, value) {
  const boolValue =
    true === value || "yes" === value || "true" === value
      ? true
      : Boolean(value);
  if (boolValue) {
    element.setAttribute(attributeName, "");
  } else {
    element.removeAttribute(attributeName);
  }
}

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

function getExists(element, attributeName) {
  return element.hasAttribute(attributeName);
}
function setExists(element, attributeName, value) {
  if (value) element.setAttribute(attributeName, "");
  else element.removeAttribute(attributeName);
}

var Attributes = {
  getString,
  setString,
  getTrueFalse,
  setTrueFalse,
  getExists,
  setExists,
};

export default Attributes;
