class ViewController {
  constructor(view) {
    this._view = view;
    this._board = view.getElementById(BOARD);
    this._boardHeight = this._board.offsetHeight - this._board.offsetTop;
  }
  get view() {
    return this._view;
  }
  get board() {
    return this._board;
  }
  get boardHeight() {
    return this._boardHeight;
  }
  barPlayerOne() {
    return this.view.getElementById('bar1');
  }
  barPlayerTwo() {
    return this.view.getElementById('bar2');
  }
  ball() {
    return this.view.getElementById('ball');
  }
  startButton() {
    return this.view.getElementById('startButton');
  }

  moveBar(id, direction) {
    const bar = this.view.getElementById(id);
    const positionY = bar.offsetTop;

    if (
      this.checkLimitTop(positionY) &&
      this.checkEquals(direction, MOVE.TOP)
    ) {
      bar.style.top = positionY - MOVE_DISTANCE_BAR + PX;
    }
    if (
      this.checkLimitBottom(positionY) &&
      this.checkEquals(direction, MOVE.BOT)
    ) {
      bar.style.top = positionY + MOVE_DISTANCE_BAR + PX;
    }
  }
  checkEquals(direction, Move) {
    return direction === Move;
  }
  checkLimitTop(positionY) {
    return positionY > BOARD_LIMIT;
  }
  checkLimitBottom(positionY) {
    return positionY < this.boardHeight - BOARD_LIMIT;
  }
  moveBall(positionActual, positionFuture) {
    return new Promise((resolve, reject) => {
      console.log('futuro x: ' + positionFuture.x);
      console.log('futuro y: ' + positionFuture.y);
      const animate = this.view.getElementById('ball').animate(
        [
          { bottom: positionActual.y + 'px', left: positionActual.x + 'px' },
          {
            bottom: positionFuture.y + 'px',
            left: positionFuture.x + 'px'
          }
        ],
        {
          duration: 6000,
          fill: 'both',
          iterations: 1
        }
      );

      animate.play(resolve());
    });
  }
  toggleButton() {
    this.disabledContinue();
    this.changeButtonValue();
  }
  changeButtonValue() {
    this.startButton().value = 'Continue';
  }
  addToScore(idBar) {
    this.tittleAnimation();
    this.enabledContinue();
    this.calculateScore(idBar);
  }
  calculateScore(idBar) {
    const score = this.view.getElementById('score-' + idBar);
    let n = parseFloat(score.innerHTML);
    n++;
    score.innerHTML = n;
  }
  enabledContinue() {
    this.startButton().disabled = false;
    this.startButton().style.cursor = 'pointer';
  }
  disabledContinue() {
    this.startButton().disabled = true;
    this.startButton().style.cursor = 'default';
  }
  tittleAnimation() {
    const goalTittle = this.view.getElementById('goal');
    goalTittle.classList.remove('animation-goal');
    setTimeout(() => {
      goalTittle.classList.add('animation-goal');
    }, 100);
  }
}
