YUI.add('flappybird-bird', function (Y, NAME) {
  function Bird(sprite) {
     for (var prop in sprite) {
      if (sprite.hasOwnProperty(prop) && typeof sprite[prop] !== 'function') {
        this[prop] = sprite[prop];
      }
     }

     this.flying = false;
  }

  Y.extend(Bird, Y.FlappyBird.Sprite);

  Bird.NAME = "flappybirdsprite";

  Bird.prototype.draw = function (context) {
    if (this.flying) {
      this.y -= 1;
    } else {
      this.y += 1;
    }

    Bird.superclass.draw.call(this, context);
  };

  Bird.prototype.startFlying = function () {
    this.flying = true;
  };

  Bird.prototype.stopFlying = function () {
    this.flying = false;
  };

  Y.namespace('FlappyBird');
  Y.FlappyBird.Bird = Bird;
}, '@VERSION@', {
  'requires': ['flappybird-sprite'],
  'optional': []});