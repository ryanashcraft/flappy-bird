"use strict";

YUI().use('node-base', 'gallery-canvas', 'io-base', 'promise', function (Y) {
  var canvas = Y.one('#game');
  var context = canvas.invoke('getContext', '2d');

  var atlasCanvas = Y.one('#atlas');
  var atlasContext = atlasCanvas.invoke('getContext', '2d');

  function atlas(atlasPath) {
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

  function Sprite(id, x, y, width, height, context) {
    this.id = id;
    this.width = parseInt(width, 10);
    this.height = parseInt(height, 10);

    this.image = context.getImageData(parseFloat(x, 10) * 1024,
                                      parseFloat(y, 10) * 1024,
                                      this.width,
                                      this.height);
  }

  Sprite.prototype = {
    draw: function (context, x, y) {
      context.putImageData(this.image, x, y);
    }
  }

  context.fillStyle = '#000000';
  context.fillRect(0, 0, canvas.get('width'), canvas.get('height'));

  Y.batch(
    atlas('/assets/atlas.txt'),
    drawAtlas('/assets/atlas.png')
    ).then(function (data) {
      var atlas = data[0];

      var sprites = atlas.split('\n').reduce(function (previousValue, line) {
        var tokens = line.split(' ');

        if (tokens.length <= 5) return previousValue;

        var id = tokens[0];
        var x = tokens[3];
        var y = tokens[4];
        var width = tokens[1];
        var height = tokens[2];

        previousValue[id] = new Sprite(id, x, y, width, height, atlasContext);

        return previousValue;
      }, []);

      sprites['bg_day'].draw(context, 0, 0);
      sprites['bg_day'].draw(context, sprites['bg_day'].width, 0);

      sprites['land'].draw(context, 0, canvas.get('height') - sprites['land'].height);
    });
});