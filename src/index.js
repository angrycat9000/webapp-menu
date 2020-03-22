import './event-logger.js';
import materialIcon from'../stories/materialIcon';
import CheckItem from './CheckItem';


function run() {
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