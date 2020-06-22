class ControllerPong {
  constructor(controller) {
    //TODO: REMOVE ALL CONSOLE LOG OF THE GAME
    this._controllerView = controller.view;
    this._servicePong = controller.serviceP;
    this._lastRegisteredPosition = INITIAL_POSITION;
    this._agregation = { x: 0, y: 0 };
    this._bar = {};
    this._direction;
    this._observable$;
    this.controlBar();
  }
  starGame = () => {
    this._controllerView.moveBall(INITIAL_POSITION, { x: -1000, y: -1000 });
    console.log('startGame');
    this.movingBall();
    this._controllerView.toggleButton();
  };
  controlBar = () => {
    this._servicePong.keyPressed$().subscribe(key => {
      this._controllerView.moveBar(PLAYER_ONE, key.code);
    });
  };

  movingBall = () => {
    this._observable$ = this._servicePong
      .movingBall$()
      .subscribe(positionActual => {
        this._direction = positionActual.b;
        this._direction += this.checkDirection(positionActual);
        this.checkAgregation();
        console.log('MovingBall:', this._agregation);
        if (
          // TODO: MAKE A METHOD CHECK FLOOR (FOR EXAMPLE)
          positionActual.b === WALL_BOUNCE.TOP ||
          positionActual.b === WALL_BOUNCE.BOT
        ) {
          this.doBounce(positionActual);
        } else if (this.checkBounceOnBar(positionActual)) {
          this.doBounce(positionActual);
        } else {
          this.isGoal(positionActual);
        }
        // TODO: REFACTOR THIS IF ELSE IF ELSE
      });
  };
  checkBar(wall) {
    this._bar.Top = (this._controllerView.barPlayerTwo().offsetTop - 800) * -1;
    this._bar.id = '1';
    if (wall === WALL_BOUNCE.IZQ) {
      this._bar.Top =
        (this._controllerView.barPlayerOne().offsetTop - 800) * -1;
      this._bar.id = '2';
    }
    this._bar.Bot = this._bar.Top - 150;
  }
  checkBounceOnBar(positionActual) {
    this.checkBar(positionActual.b);
    if (positionActual.y > this._bar.Bot && positionActual.y < this._bar.Top) {
      return true;
    }
    return false;
  }
  isGoal(positionActual) {
    console.log('GOOOL');
    this._observable$.unsubscribe();
    //this._controllerView.addToScore(this._bar.id);
    this._controllerView
      .moveBall(positionActual, INITIAL_POSITION)
      .then(successMessage => {
        console.log('ISGOAL: Ha pasado');
        this._lastRegisteredPosition = INITIAL_POSITION;
        this._controllerView.addToScore(this._bar.id);
      });

    // TODO: RESET THE GAME (MAYBE ADD A BOTON TO "CONTINUE GAME")
  }
  doBounce(positionActual) {
    let positionFuture;
    positionFuture = this.COMMANDBOUNCE.execute(
      this._direction,
      positionActual
    );
    this._controllerView
      .moveBall(positionActual, positionFuture)
      .then(successMessage => {
        this._lastRegisteredPosition = positionActual;
      });
  }
  COMMANDBOUNCE = {
    BOT_L: this.doBounceLeft,
    TOP_R: this.doBounceRight,
    IZQ_U: this.doBounceUp,
    DER_D: this.doBounceDown,

    TOP_L: this.doBounceDown,
    BOT_R: this.doBounceUp,
    DER_U: this.doBounceRight,
    IZQ_D: this.doBounceLeft,

    execute: (command, parameters = {}) => {
      return this.COMMANDBOUNCE[command].call(this, parameters);
    }
  };
  doBounceLeft(positionActual) {
    let coorX =
      positionActual.x - (positionActual.x - this._lastRegisteredPosition.x);
    let coorY = this._lastRegisteredPosition.y;
    console.log('antes : ' + coorX + ', ' + coorY);
    return { x: coorX + this._agregation.x, y: coorY + this._agregation.y };
  }
  doBounceRight(positionActual) {
    let coorX =
      positionActual.x +
      (positionActual.x - this._lastRegisteredPosition.x) +
      this._agregation.x;
    let coorY = this._lastRegisteredPosition.y + this._agregation.y;
    console.log('antes : ' + coorX + ', ' + coorY);
    return { x: coorX, y: coorY };
  }

  doBounceUp(positionActual) {
    let coorX = this._lastRegisteredPosition.x + this._agregation.x;
    let coorY =
      positionActual.y +
      (positionActual.y - this._lastRegisteredPosition.y) +
      this._agregation.y;
    return { x: coorX, y: coorY };
  }

  doBounceDown(positionActual) {
    WALL_BOUNCE;
    let coorX = this._lastRegisteredPosition.x;
    let coorY =
      positionActual.y - (this._lastRegisteredPosition.y - positionActual.y);
    console.log('antes : ' + coorX + ', ' + coorY);
    return { x: coorX + this._agregation.x, y: coorY + this._agregation.y };
  }
  checkAgregation() {
    if (this._direction === 'BOT_L' || this._direction === 'DER_U') {
      this._agregation.x = AGREGATION_MINUS;
      this._agregation.y = AGREGATION_PLUS;
    }
    if (this._direction === 'TOP_R' || this._direction === 'IZQ_D') {
      this._agregation.x = AGREGATION_PLUS;
      this._agregation.y = AGREGATION_MINUS;
    }
    if (this._direction === 'IZQ_U' || this._direction === 'BOT_R') {
      this._agregation.x = AGREGATION_PLUS;
      this._agregation.y = AGREGATION_PLUS;
    }
    if (this._direction === 'DER_D' || this._direction === 'TOP_L') {
      this._agregation.x = AGREGATION_MINUS;
      this._agregation.y = AGREGATION_MINUS;
    }
  }

  checkDirection(positionActual) {
    return this.COMMANDBOUNCEDIRECTION.execute(this._direction, positionActual);
  }
  COMMANDBOUNCEDIRECTION = {
    IZQ_: this.checkBounceFromVertical,
    DER_: this.checkBounceFromVertical,
    TOP_: this.checkBounceFromHorizontal,
    BOT_: this.checkBounceFromHorizontal,

    execute: (command, parameters = {}) => {
      return this.COMMANDBOUNCEDIRECTION[command].call(this, parameters);
    }
  };
  checkBounceFromVertical(positionActual) {
    let result = DIRECTION.UP;
    if (this._lastRegisteredPosition.y > positionActual.y) {
      result = DIRECTION.DOWN;
    }
    return result;
  }
  checkBounceFromHorizontal(positionActual) {
    let result = DIRECTION.RIGHT;
    if (this._lastRegisteredPosition.x > positionActual.x) {
      result = DIRECTION.LEFT;
    }
    return result;
  }
}
