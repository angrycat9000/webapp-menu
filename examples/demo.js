import Menu from '../dist/webapp-menu.js';
import './event-logger.js';

function materialIcon(name) {
    const icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.innerHTML = name;
    return icon;
}

function run() {
    const toolbar = document.createElement("wam-toolbar");
    toolbar.iconFactory = icon => {
      const element = document.createElement("i");
      element.classList.add("material-icons");
      element.innerHTML = icon;
      return element;
    };
    toolbar.controlledBy = document.getElementById("toolbar-button");
    toolbar.items.set([
      { label: "Bold", icon: "format_bold" },
      { label: "Italics", icon: "format_italic" },
      { label: "Underline", icon: "format_underline" },
      { label: "Clear Formatting", icon: "format_clear" }
    ]);
    document.body.appendChild(toolbar);
  }
  
  if ("loading" == document.readyState)
    window.addEventListener("DOMContentLoaded", run);
  else run();