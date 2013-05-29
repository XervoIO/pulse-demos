var Ball = pulse.Sprite.extend({
   init: function(args) {

      args = args || {};
      args.src = 'ball.png';

      this.velocity = { x: (Math.random() * 300) - 150, y: (Math.random() * 300) - 150 };

      this._super(args);
   },
   update: function(elapsedMS) {

      var newX = this.position.x + this.velocity.x * (elapsedMS / 1000);
      var newY = this.position.y + this.velocity.y * (elapsedMS / 1000);

      if(newX - (this.size.width / 2) <= 0) {
         newX = this.size.width / 2;
         this.velocity.x *= -1;
      }

      if(newY - (this.size.height / 2) <= 0) {
         newY = this.size.height / 2;
         this.velocity.y *= -1;
      }

      if(newX + (this.size.width / 2) >= 640) {
         newX = 640 - this.size.width / 2;
         this.velocity.x *= -1;
      }

      if(newY + (this.size.height / 2) >= 480) {
         newY = 480 - this.size.height / 2;
         this.velocity.y *= -1;
      }

      this.position.x = newX;
      this.position.y = newY;

      this._super(elapsedMS);
   }
});