(function () {
  "use strict";

  window.addEventListener("DOMContentLoaded", function () {
    var ns = window.PawsBelow;
    var input = new ns.InputController();
    var ui = new ns.UI({
      energyFill: document.getElementById("energyFill")
    });
    var game = new ns.GameState({
      canvas: document.getElementById("gameCanvas"),
      input: input,
      ui: ui
    });

    game.start();
  });
})();
