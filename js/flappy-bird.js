"use strict";

YUI().use('node-base', 'gallery-canvas', 'io-base', 'promise', 'event', function (Y) {
  function FlappyBirdGame(canvas, atlasCanvas) {
    var exports = {};

    var context = canvas.invoke('getContext', '2d');
    var atlasContext = atlasCanvas.invoke('getContext', '2d');
    var sprites;

    exports.init = function (callback) {
      canvas.on('touchstart', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });

      function getAtlas(atlasPath) {
        return new Y.Promise(function (resolve, reject) {
          Y.io(atlasPath, {
            on: {
              success: function (id, response) {
                resolve(response.responseText);
              },
              failure: function (id, response) {
                reject(new Error(atlasPath + " request failed: " + response));
              }
            }
          });
        });
      }

      function drawAtlas(imagePath) {
        return new Y.Promise(function (resolve, reject) {
          var image = new Image();

          image.onload = function () {
            atlasContext.drawImage(image, 0, 0);

            resolve();
          };

          image.src = imagePath;
        });
      }

      context.fillStyle = '#000000';
      context.fillRect(0, 0, canvas.get('width'), canvas.get('height'));

      Y.batch(
        getAtlas('/assets/atlas.txt'),
        drawAtlas('/assets/atlas.png')
      ).then(function (data) {
        var atlas = data[0];

        sprites = atlas.split('\n').reduce(function (previousValue, line) {
          var tokens = line.split(' ');

          if (tokens.length <= 5) return previousValue;

          var id = tokens[0];
          var x = tokens[3];
          var y = tokens[4];
          var width = tokens[1];
          var height = tokens[2];

          previousValue[id] = new Sprite(id, x, y, width, height, atlasContext);

          return previousValue;
        }, {});

        callback();
      });
    };

    exports.tick = function (timestamp) {
      context.clearRect(0, 0, canvas.get('width'), canvas.get('height'));

      sprites['bg_day'].draw(context);
      sprites['bg_day'].setX(sprites['bg_day'].getWidth() - 10);
      sprites['bg_day'].draw(context);
      sprites['bg_day'].setX(0);

      sprites['land'].setY(canvas.get('height') - sprites['land'].getHeight());
      sprites['land'].setX(sprites['land'].getX() - 1);
      sprites['land'].draw(context);
      sprites['land'].setX(sprites['land'].getX() + sprites['land'].getWidth());
      sprites['land'].draw(context);
      sprites['land'].setX(sprites['land'].getX() - sprites['land'].getWidth());
      if (sprites['land'].getX() <= -sprites['land'].getWidth()) {
        sprites['land'].setX(0);
      }

      requestAnimationFrame(exports.tick);
    }

    return exports;
  }

  function Sprite(id, atlasX, atlasY, atlasWidth, atlasHeight, atlasContext) {
    var exports = {};

    var id = id;
    var x = 0;
    var y = 0;
    var width = parseInt(atlasWidth, 10);
    var height = parseInt(atlasHeight, 10);

    var image = atlasContext.getImageData(parseFloat(atlasX, 10) * 1024,
                                           parseFloat(atlasY, 10) * 1024,
                                           atlasWidth,
                                           atlasHeight);

    exports.draw = function(context) {
      context.putImageData(image, x, y);
    }

    exports.setX = function(newValue) {
      x = newValue;
    }

    exports.setY = function(newValue) {
      y = newValue;
    }

    exports.getX = function() {
      return x;
    }

    exports.getY = function() {
      return y;
    }

    exports.getWidth = function() {
      return width;
    }

    exports.getHeight = function() {
      return height;
    }

    return exports;
  }

  var canvas = Y.one('#game');
  var atlasCanvas = Y.one('#atlas');
  var game = new FlappyBirdGame(canvas, atlasCanvas);

  game.init(function () {
    requestAnimationFrame(game.tick);
  });
});