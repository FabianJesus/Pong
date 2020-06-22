class ServicePong {
  constructor(view) {
    this._view = view;
  }
  get view() {
    return this._view;
  }
  keyPressed$ = () =>
    rxjs
      .fromEvent(document, KEYDOWN)
      .pipe(
        rxjs.operators.filter(
          key => key.code === KEYS.UP || key.code === KEYS.DOWN
        )
      );

  movingBall$() {
    return rxjs.interval(50).pipe(
      rxjs.operators.map(t => {
        // const ball = view.ball;
        // const ball = view.getElementById('ball');
        const ball = window.document.getElementById('ball');
        const positionY = (ball.offsetTop - 753) * -1;
        const positionX = ball.offsetLeft;
        return { y: positionY, x: positionX };
      }),
      rxjs.operators.distinctUntilChanged(),
      rxjs.operators.filter(positionActual => {
        /* positionActual.x <= 5 || Vote en la pared  */
        if (positionActual.x <= 125) {
          return (positionActual.b = WALL_BOUNCE.IZQ);
        } /* positionActual.x >= 1295 || Vote en la pared */
        if (positionActual.x >= 1230) {
          return (positionActual.b = WALL_BOUNCE.DER);
        }
        if (positionActual.y <= 5) {
          return (positionActual.b = WALL_BOUNCE.BOT);
        }
        if (positionActual.y >= 695) {
          return (positionActual.b = WALL_BOUNCE.TOP);
        }
      })
    );
  }
}
