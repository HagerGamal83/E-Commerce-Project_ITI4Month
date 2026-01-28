function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

loadComponent("header", "../HTML/Header.html");
// loadComponent("nav", "../HTML/Nav.html");
 loadComponent("footer", "../HTML/footer.html");