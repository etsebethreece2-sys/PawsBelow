(function () {
  "use strict";

  window.PawsBelow = window.PawsBelow || {};

  window.PawsBelow.CONFIG = {
    tileSize: 32,
    worldWidth: 72,
    surfaceY: 5,
    maxEnergy: 100,
    moveEnergyCost: 1,
    inputRepeatMs: 120,
    moveCooldownMs: 82,
    seed: 41973,
    colors: {
      skyTop: "#8fc7d8",
      skyBottom: "#d5ead7",
      cave: "#151b1f",
      caveDeep: "#0e1316",
      tunnel: "#273036",
      dirt: "#8b5d3d",
      dirtDark: "#60432e",
      dirtLight: "#aa7650",
      grass: "#4c934f",
      grassLight: "#8ed061",
      cat: "#9ca4aa",
      catLight: "#d0d5d8",
      catDark: "#555d65",
      catNose: "#e7a6a6"
    }
  };
})();
