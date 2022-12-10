function run() {
  document.querySelector('wam-menu[open]')
    .addEventListener(
      "wam-item-activate", 
      (event) => { 
        event.preventDefault() 
    })
}

if ("loading" == document.readyState)
  window.addEventListener("DOMContentLoaded", run);
else run();