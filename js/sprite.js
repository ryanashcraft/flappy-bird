YUI.add('flappybird-sprite', function (Y, NAME) {
  function Sprite(id, atlasX, atlasY, atlasWidth, atlasHeight, sourceImage) {
    this.id = id;

    this.atlasX = parseFloat(atlasX, 10) * 1024;
    this.atlasY = parseFloat(atlasY, 10) * 1024;

    this.x = 0;
    this.y = 0;

    this.width = parseFloat(atlasWidth, 10);
    this.height = parseFloat(atlasHeight, 10);

    this.sourceImage = sourceImage;
  }

  Sprite.NAME = "flappybirdsprite";

  Sprite.prototype = {
    draw: function(context) {
      context.save();
      context.translate(this.x, this.y);
      
      if (this.rotation !== undefined) {
        context.translate(this.width / 2, this.height / 2);
        context.rotate(this.rotation);

         context.drawImage(this.sourceImage,
          this.atlasX,
          this.atlasY,
          this.width,
          this.height,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height);
      } else {
         context.drawImage(this.sourceImage,
          this.atlasX,
          this.atlasY,
          this.width,
          this.height,
          0,
          0,
          this.width,
          this.height);
      }
     
      context.restore();
    },

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

  Y.namespace('FlappyBird');
  Y.FlappyBird.Sprite = Sprite;
}, '@VERSION@', {
  'requires': [],
  'optional': []});