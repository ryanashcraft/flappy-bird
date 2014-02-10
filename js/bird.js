YUI.add('flappybird-bird', function (Y, NAME) {
  var FLYING_TIME = 350;
  var MAX_DY = 2;
  var MAX_ROTATION = Math.PI / 2;
  var MIN_ROTATION = -Math.PI / 8;
  var G_ACCELERATION = 0.05;
  var MULTIPLIER = 8;

  function Bird(sprite) {
     for (var prop in sprite) {
      if (sprite.hasOwnProperty(prop) && typeof sprite[prop] !== 'function') {
        this[prop] = sprite[prop];
      }
     }

     this.dy = 0;
     this.flying = false;
     this.timeStartedFlying = null;
  }

  Y.extend(Bird, Y.FlappyBird.Sprite);

  Bird.NAME = "flappybirdsprite";

  Bird.prototype.draw = function (context, timestamp) {
    if (this.flying) {
      if (this.timeStartedFlying === null) {
        this.timeStartedFlying = timestamp;
      } else if (timestamp - this.timeStartedFlying < FLYING_TIME) {
        var d = (1 - (timestamp - this.timeStartedFlying) / FLYING_TIME);
        this.dy =- Math.pow(d, 2);
      } else {
        this.flying = false;
        this.timeStartedFlying = null;
      }
    } else {
      this.dy += Math.min(G_ACCELERATION, MAX_DY);
    }

    this.y += this.dy * MULTIPLIER;

    this.rotation = Math.max(Math.min(this.dy + MIN_ROTATION / MAX_DY, MAX_ROTATION), MIN_ROTATION);
    
    Bird.superclass.draw.call(this, context);
  };

  Bird.prototype.startFlying = function () {
    this.flying = true;
    this.timeStartedFlying = null;
  };

  Y.namespace('FlappyBird');
  Y.FlappyBird.Bird = Bird;
}, '@VERSION@', {
  'requires': ['flappybird-sprite'],
  'optional': []});