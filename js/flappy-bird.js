"use strict";

YUI().use('node-base',
          'gallery-canvas',
          'io-base',
          'promise',
          'event',
          'oop',
          'flappybird-game', function (Y) {
  var canvas = Y.one('#game');
  var game = new Y.FlappyBird.Game(canvas);

  game.init(function () {
    requestAnimationFrame(game.tick.bind(game));
  });
});