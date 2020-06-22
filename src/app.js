document.addEventListener('DOMContentLoaded', event => {
  const view = new ViewController(window.document);
  const serviceP = new ServicePong(window.document);
  controllerP = new ControllerPong({ view, serviceP });
  console.log('content laodede');
  /* controllerP.starGame();*/
});
