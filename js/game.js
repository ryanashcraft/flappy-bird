YUI.add('flappybird-game', function (Y, NAME) {
  function FlappyBirdGame(canvas) {
    this.canvas = canvas;
    this.context = canvas.invoke('getContext', '2d');
    this.sourceImage;
    this.sprites;
  }

  FlappyBirdGame.NAME = "flappybirdgame";

  FlappyBirdGame.prototype = {
    init: function (callback) {
      this.canvas.on('touchstart', function (e) {
        this.bird.startFlying();

        e.preventDefault();
        e.stopPropagation();
      }.bind(this));
      
      this.canvas.on('mousedown', function () {
        this.bird.startFlying();
      }.bind(this));

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
          sourceImage = document.createElement('img');

          sourceImage.onload = function () {
            resolve();
          };

          sourceImage.src = imagePath;
        });
      }

      function loadSprites(data) {
        var atlas = data[0];

        sprites = atlas.split('\n').reduce(function (previousValue, line) {
          var tokens = line.split(' ');

          if (tokens.length <= 5) return previousValue;

          var id = tokens[0];
          var x = tokens[3];
          var y = tokens[4];
          var width = tokens[1];
          var height = tokens[2];

          previousValue[id] = new Y.FlappyBird.Sprite(id, x, y, width, height, sourceImage);

          return previousValue;
        }, {});

        this.bird = new Y.FlappyBird.Bird(sprites['bird0_0']);
        this.bird.setCenterX(this.canvas.get('width') / 2);
        this.bird.setCenterY(this.canvas.get('height') / 2);

        callback();
      }

      this.context.fillStyle = '#000000';
      this.context.fillRect(0, 0, this.canvas.get('width'), this.canvas.get('height'));

      Y.batch(
        getAtlas('/assets/atlas.txt'),
        drawAtlas('/assets/atlas.png')
      ).then(loadSprites.bind(this));
    },

    tick: function (timestamp) {
      this.context.clearRect(0, 0, this.canvas.get('width'), this.canvas.get('height'));

      sprites['bg_day'].draw(this.context);
      sprites['bg_day'].setX(sprites['bg_day'].getWidth() - 10);
      sprites['bg_day'].draw(this.context);
      sprites['bg_day'].setX(0);

      sprites['land'].setY(this.canvas.get('height') - sprites['land'].getHeight());
      sprites['land'].setX(sprites['land'].getX() - 1);
      sprites['land'].draw(this.context);
      sprites['land'].setX(sprites['land'].getX() + sprites['land'].getWidth());
      sprites['land'].draw(this.context);
      sprites['land'].setX(sprites['land'].getX() - sprites['land'].getWidth());
      if (sprites['land'].getX() <= -sprites['land'].getWidth()) {
        sprites['land'].setX(0);
      }

      this.bird.draw(this.context, timestamp);

      requestAnimationFrame(this.tick.bind(this));
    }
  }

  Y.namespace('FlappyBird');
  Y.FlappyBird.Game = FlappyBirdGame;
}, '@VERSION@', {
  'requires': ['flappybird-sprite', 'flappybird-bird'],
  'optional': []});