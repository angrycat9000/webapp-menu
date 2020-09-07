import './event-logger.js';
import IconFactory from './IconFactory';


function run() {
    IconFactory.defaultFactory = IconFactory.materialIcon;

    const clearButton = document.querySelector('#toolbar-example wam-item');
    clearButton.addEventListener('wam-item-activate', ()=>{
      const toggles = document.querySelectorAll('#toolbar-example wam-check-item');
      for(const t of toggles) {
        t.checked = false;
      }
    });
  }
  
  if ("loading" == document.readyState)
    window.addEventListener("DOMContentLoaded", run);
  else run();