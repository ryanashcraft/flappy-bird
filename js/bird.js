YUI.add('flappybird-bird', function (Y, NAME) {
  var FLYING_TIME = 350;
  var MAX_DY = 2;
  var MAX_ROTATION = Math.PI / 2;
  var MIN_ROTATION = -Math.PI / 8;
  var G_ACCELERATION = 0.05;
  var MULTIPLIER = 8;

  function Bird(sprites) {
    this.sprites = sprites;

    this.x = sprites[0].x;
    this.y = sprites[0].y;

    this.rotation = 0;

    this.dy = 0;

    this.width = sprites[0].width;
    this.height = sprites[0].height;

    this.flying = false;
    this.timeStartedFlying = null;

    this.spriteIndex = 0;
  }

  Bird.NAME = "flappybirdbird";

  Bird.prototype = {
    getX: function() {
      return this.x;
    },

    setX: function(newValue) {
      this.x = newValue;
    },

    setCenterX: function(newValue) {
      this.x = newValue - this.width / 2;
    },

    getY: function() {
      return this.y;
    },

    setY: function(newValue) {
      this.y = newValue;
    },

    setCenterY: function(newValue) {
      this.y = newValue - this.height / 2;
    },

    getWidth: function() {
      return this.width;
    },

    getHeight: function() {
      return this.height;
    }
  };

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
      this.dy = Math.min(this.dy + G_ACCELERATION, MAX_DY);
    }

    this.y += this.dy * MULTIPLIER;

    this.rotation = Math.max(Math.min(this.dy + MIN_ROTATION / MAX_DY, MAX_ROTATION), MIN_ROTATION);
    
    this.spriteIndex = Math.floor(timestamp / 50) % this.sprites.length;
    if (this.dy >= 0.5) {
      this.spriteIndex = 0;
    }

    this.sprites[this.spriteIndex].x = this.x;
    this.sprites[this.spriteIndex].y = this.y;
    this.sprites[this.spriteIndex].rotation = this.rotation;

    this.sprites[this.spriteIndex].draw.call(this.sprites[this.spriteIndex], context);
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