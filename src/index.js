import './event-logger.js';
import materialIcon from'../stories/materialIcon';


function run() {
    const toolbar = document.createElement("wam-toolbar");
    toolbar.iconFactory = materialIcon;
    toolbar.controlledBy = document.getElementById("toolbar-button");
    toolbar.items.set([
      { label: "Bold", icon: "format_bold" },
      { label: "Italics", icon: "format_italic" },
      { label: "Underline", icon: "format_underline" },
      { label: "Clear Formatting", icon: "format_clear", showToolbarLabel:true }
    ]);
    document.body.appendChild(toolbar);
  }
  
  if ("loading" == document.readyState)
    window.addEventListener("DOMContentLoaded", run);
  else run();