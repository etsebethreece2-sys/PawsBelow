(function () {
  "use strict";

  window.PawsBelow = window.PawsBelow || {};

  var CONFIG = window.PawsBelow.CONFIG;
  var MathUtil = window.PawsBelow.MathUtil;
  var Tiles = window.PawsBelow.Tiles;

  function Cat(world) {
    this.reset(world);
  }

  Cat.prototype.reset = function (world) {
    this.x = world.startX;
    this.y = world.surfaceY - 1;
    this.facing = 1;
    this.energy = CONFIG.maxEnergy;
    this.deepest = 0;
    this.steps = 0;
    this.bump = 0;
    this.lastAction = "idle";
  };

  Cat.prototype.tryMove = function (dx, dy, world, effects, audio) {
    var targetX = this.x + dx;
    var targetY = this.y + dy;
    var tile;
    var def;
    var result;

    if (dx !== 0) {
      this.facing = MathUtil.sign(dx);
    }

    if (!this.canTarget(targetX, targetY, world)) {
      this.bump = 1;
      this.lastAction = "bump";
      audio.play("bump");
      return false;
    }

    tile = world.getTile(targetX, targetY);
    def = Tiles.getTileDef(tile.type);

    if (!def.solid) {
      this.moveTo(targetX, targetY, world);
      this.spendEnergy(CONFIG.moveEnergyCost);
      this.lastAction = "step";
      audio.play("step");
      return true;
    }

    if (!def.diggable) {
      this.bump = 1;
      this.lastAction = "bump";
      audio.play("bump");
      return false;
    }

    this.spendEnergy(def.cost);
    result = world.hitTile(targetX, targetY);
    effects.addDigBurst(targetX, targetY, def.color);

    if (result.broke) {
      this.moveTo(targetX, targetY, world);
      this.lastAction = "break";
      audio.play("dig");
    } else {
      this.lastAction = "chip";
      audio.play("chip");
    }

    return true;
  };

  Cat.prototype.canTarget = function (targetX, targetY, world) {
    if (targetX < 0 || targetX >= world.width) {
      return false;
    }

    if (targetY < world.surfaceY - 1) {
      return false;
    }

    if (this.y === world.surfaceY - 1 && targetY < world.surfaceY - 1) {
      return false;
    }

    return true;
  };

  Cat.prototype.moveTo = function (x, y, world) {
    this.x = MathUtil.clamp(x, 0, world.width - 1);
    this.y = y;
    this.steps += 1;
    this.bump = 1;
    this.deepest = Math.max(this.deepest, this.depth(world));

    if (this.y < world.surfaceY) {
      this.energy = CONFIG.maxEnergy;
    }
  };

  Cat.prototype.spendEnergy = function (amount) {
    this.energy = Math.max(0, this.energy - amount);
  };

  Cat.prototype.depth = function (world) {
    return Math.max(0, this.y - world.surfaceY + 1);
  };

  Cat.prototype.update = function (dt) {
    this.bump = Math.max(0, this.bump - dt * 8);
  };

  window.PawsBelow.Cat = Cat;
})();
