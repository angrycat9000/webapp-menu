import './event-logger.js';
import materialIcon from'../stories/materialIcon';
import CheckItem from './CheckItem';


function run() {
    const toolbar = document.createElement("wam-toolbar");
    toolbar.iconFactory = materialIcon;
    toolbar.controlledBy = document.getElementById("toolbar-button");
    toolbar.isPopup = true;
    toolbar.items.set([
      { label: "Bold", icon: "format_bold" },
      { label: "Italics", icon: "format_italic" },
      { label: "Underline", icon: "format_underline" },
      { label: "Clear Formatting", icon: "format_clear", showToolbarLabel:true },
      { label: "Show", type:CheckItem}
    ]);
    document.body.appendChild(toolbar);
  }
  
  if ("loading" == document.readyState)
    window.addEventListener("DOMContentLoaded", run);
  else run();