YUI.add('flappybird-bird', function (Y, NAME) {
  function Bird(sprite) {
     for (var prop in sprite) {
      if (sprite.hasOwnProperty(prop) && typeof sprite[prop] !== 'function') {
        this[prop] = sprite[prop];
      }
     }
  }

  Y.extend(Bird, Y.FlappyBird.Sprite);

  Bird.NAME = "flappybirdsprite";

  Bird.prototype.draw = function (context) {
    Bird.superclass.draw.call(this, context);
  }

  Y.namespace('FlappyBird');
  Y.FlappyBird.Bird = Bird;
}, '@VERSION@', {
  'requires': ['flappybird-sprite'],
  'optional': []});