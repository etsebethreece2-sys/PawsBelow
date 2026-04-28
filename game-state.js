(function () {
  "use strict";

  window.PawsBelow = window.PawsBelow || {};

  var CONFIG = window.PawsBelow.CONFIG;

  function GameState(options) {
    this.canvas = options.canvas;
    this.input = options.input;
    this.ui = options.ui;
    this.renderer = new window.PawsBelow.Renderer(this.canvas);
    this.audio = new window.PawsBelow.AudioSystem();
    this.effects = new window.PawsBelow.Effects();
    this.camera = new window.PawsBelow.Camera();
    this.frame = 0;
    this.time = 0;
    this.dt = 0;
    this.lastNow = 0;
    this.actionCooldown = 0;
    this.mode = "running";
    this.reset();
  }

  GameState.prototype.reset = function () {
    this.world = new window.PawsBelow.World(CONFIG.seed + Math.floor(Date.now() % 100000));
    this.cat = new window.PawsBelow.Cat(this.world);
    this.effects = new window.PawsBelow.Effects();
    this.camera = new window.PawsBelow.Camera();
    this.actionCooldown = 0;
    this.mode = "running";
  };

  GameState.prototype.start = function () {
    window.requestAnimationFrame(this.loop.bind(this));
  };

  GameState.prototype.loop = function (now) {
    if (!this.lastNow) {
      this.lastNow = now;
    }

    this.dt = Math.min(0.05, (now - this.lastNow) / 1000);
    this.time += this.dt;
    this.lastNow = now;
    this.frame += 1;

    this.update(now);
    this.renderer.render(this);
    this.ui.update(this);

    window.requestAnimationFrame(this.loop.bind(this));
  };

  GameState.prototype.update = function (now) {
    var dir;

    if (this.input.consumeRestart()) {
      this.reset();
      return;
    }

    if (this.mode !== "running") {
      this.effects.update(this.dt);
      return;
    }

    this.input.update(now);
    this.actionCooldown = Math.max(0, this.actionCooldown - this.dt * 1000);

    if (this.actionCooldown <= 0) {
      dir = this.input.consumeDirection();

      if (dir) {
        this.cat.tryMove(dir.dx, dir.dy, this.world, this.effects, this.audio);
        this.actionCooldown = CONFIG.moveCooldownMs;
      }
    }

    this.cat.update(this.dt);
    this.effects.update(this.dt);

    if (this.cat.energy <= 0 && this.cat.y >= this.world.surfaceY) {
      this.mode = "spent";
    }
  };

  window.PawsBelow.GameState = GameState;
})();
